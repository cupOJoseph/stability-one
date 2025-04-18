import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { capitalOneAPI } from "./services/capitalOne";
import session from "express-session";
import { authenticateSession } from "./middleware/auth";
import MemoryStore from "memorystore";
import crypto from "crypto";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // OAuth state endpoint
  app.post("/api/auth/state", async (req, res) => {
    try {
      const { state } = req.body;
      if (!state) {
        return res.status(400).json({ message: "State parameter is required" });
      }

      await storage.createAuthState({ state });
      res.status(200).json({ message: "State registered successfully" });
    } catch (error) {
      console.error("Error registering state:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // OAuth callback endpoint
  app.post("/api/auth/callback", async (req, res) => {
    try {
      const { code, state } = req.body;
      
      if (!code || !state) {
        return res.status(400).json({ message: "Code and state parameters are required" });
      }

      // Verify state to prevent CSRF
      const storedState = await storage.getAuthState(state);
      if (!storedState) {
        return res.status(400).json({ message: "Invalid state parameter" });
      }

      // Exchange code for access token
      const tokenResponse = await capitalOneAPI.exchangeCodeForToken(code);
      
      // Find or create user
      const userProfile = await capitalOneAPI.getUserProfile(tokenResponse.access_token);
      
      // Check if user exists
      let user = await storage.getUserByUsername(userProfile.email);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await storage.createUser({
          username: userProfile.email,
          password: crypto.randomBytes(16).toString('hex'), // Generate random password for OAuth users
          capitalOneAccessToken: tokenResponse.access_token,
          capitalOneRefreshToken: tokenResponse.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
          userProfile: userProfile
        });
      } else {
        // Update existing user's tokens
        await storage.updateUserTokens(user.id, {
          capitalOneAccessToken: tokenResponse.access_token,
          capitalOneRefreshToken: tokenResponse.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
          userProfile: userProfile
        });
      }

      // Set user in session
      req.session.userId = user.id;
      
      // Delete used state
      await storage.deleteAuthState(state);

      res.status(200).json({ message: "Authentication successful" });
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/me", authenticateSession, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Return user profile without sensitive information
      res.status(200).json({
        id: user.id,
        username: user.username,
        profile: user.userProfile
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Dashboard data endpoint
  app.get("/api/dashboard", authenticateSession, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if token is expired and refresh if needed
      if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) <= new Date()) {
        if (!user.capitalOneRefreshToken) {
          return res.status(401).json({ message: "Authentication expired. Please log in again." });
        }

        const tokenResponse = await capitalOneAPI.refreshAccessToken(user.capitalOneRefreshToken);
        
        await storage.updateUserTokens(user.id, {
          capitalOneAccessToken: tokenResponse.access_token,
          capitalOneRefreshToken: tokenResponse.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000)
        });
        
        user.capitalOneAccessToken = tokenResponse.access_token;
      }

      // Fetch financial data from Capital One API
      const [accounts, transactions, spendingCategories, upcomingBills] = await Promise.all([
        capitalOneAPI.getAccounts(user.capitalOneAccessToken!),
        capitalOneAPI.getTransactions(user.capitalOneAccessToken!),
        capitalOneAPI.getSpendingCategories(user.capitalOneAccessToken!),
        capitalOneAPI.getUpcomingBills(user.capitalOneAccessToken!)
      ]);

      // Calculate total balance and format data
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      
      // Return formatted dashboard data
      res.status(200).json({
        user: {
          firstName: user.userProfile?.firstName || "User",
          lastName: user.userProfile?.lastName || "",
          email: user.username
        },
        accounts: {
          totalBalance,
          growthPercentage: 2.4, // Example value
          checking: accounts.filter(a => a.type === 'checking'),
          savings: accounts.filter(a => a.type === 'savings'),
          credit: accounts.filter(a => a.type === 'credit')
        },
        transactions,
        spendingCategories,
        upcomingBills
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to retrieve dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
