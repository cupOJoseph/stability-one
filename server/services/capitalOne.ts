import axios from 'axios';
import crypto from 'crypto';

// Capital One API Configuration
const API_BASE_URL = 'https://api-sandbox.capitalone.com';
const CLIENT_ID = process.env.CAPITAL_ONE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.CAPITAL_ONE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.CAPITAL_ONE_REDIRECT_URI || '';

/**
 * Service to interact with Capital One API
 */
class CapitalOneAPI {
  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth2/token`, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/identity/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Get user accounts
   */
  async getAccounts(accessToken: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Since this is a sandbox, we'll generate sample data for demo purposes
      // In a real implementation, you would transform the actual API response
      return [
        {
          id: 'check-1',
          type: 'checking',
          name: 'Primary Checking',
          balance: 8942.35,
          available: 8942.35,
          accountNumber: '****8546',
          interestRate: null
        },
        {
          id: 'save-1',
          type: 'savings',
          name: 'High-Yield Savings',
          balance: 15620.45,
          available: 15620.45,
          accountNumber: '****4298',
          interestRate: 1.25
        }
      ];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  }

  /**
   * Get user transactions
   */
  async getTransactions(accessToken: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Sample transactions for demo
      return [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          description: 'Coffee Shop Purchase',
          amount: -4.85,
          category: 'Food & Dining',
          merchant: 'Starbucks',
          accountId: 'check-1',
          accountName: 'Checking ****8546'
        },
        {
          id: crypto.randomUUID(),
          date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          description: 'Rideshare',
          amount: -18.45,
          category: 'Transportation',
          merchant: 'Uber',
          accountId: 'check-1',
          accountName: 'Checking ****8546'
        },
        {
          id: crypto.randomUUID(),
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          description: 'Food Delivery',
          amount: -32.50,
          category: 'Food & Dining',
          merchant: 'Grubhub',
          accountId: 'check-1',
          accountName: 'Checking ****8546'
        },
        {
          id: crypto.randomUUID(),
          date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          description: 'Online Shopping',
          amount: -65.27,
          category: 'Shopping',
          merchant: 'Amazon',
          accountId: 'check-1',
          accountName: 'Checking ****8546'
        },
        {
          id: crypto.randomUUID(),
          date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          description: 'Salary Deposit',
          amount: 1250.00,
          category: 'Income',
          merchant: 'Capital One',
          accountId: 'check-1',
          accountName: 'Checking ****8546'
        }
      ];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get spending categories
   */
  async getSpendingCategories(accessToken: string) {
    try {
      // Note: This would be a real API call in a production environment
      // Since this is a demo, return sample data
      return [
        {
          category: 'Housing',
          amount: 1200.00,
          percentage: 38,
          icon: 'home',
          color: 'blue'
        },
        {
          category: 'Food & Dining',
          amount: 685.25,
          percentage: 22,
          icon: 'restaurant',
          color: 'green'
        },
        {
          category: 'Transportation',
          amount: 542.80,
          percentage: 17,
          icon: 'car',
          color: 'yellow'
        },
        {
          category: 'Shopping',
          amount: 428.50,
          percentage: 13,
          icon: 'shopping-bag',
          color: 'red'
        },
        {
          category: 'Other',
          amount: 310.25,
          percentage: 10,
          icon: 'category',
          color: 'gray'
        }
      ];
    } catch (error) {
      console.error('Error fetching spending categories:', error);
      throw new Error('Failed to fetch spending categories');
    }
  }

  /**
   * Get upcoming bills
   */
  async getUpcomingBills(accessToken: string) {
    try {
      // This would be a real API call in a production environment
      // Since this is a demo, return sample data
      return [
        {
          id: crypto.randomUUID(),
          name: 'Rent',
          amount: 1200.00,
          dueDate: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
          daysRemaining: 5,
          icon: 'home',
          color: 'blue',
          category: 'Housing',
          isPaid: false
        },
        {
          id: crypto.randomUUID(),
          name: 'Electric Bill',
          amount: 85.75,
          dueDate: new Date(Date.now() + 1036800000).toISOString(), // 12 days from now
          daysRemaining: 12,
          icon: 'bolt',
          color: 'yellow',
          category: 'Utilities',
          isPaid: false
        },
        {
          id: crypto.randomUUID(),
          name: 'Internet',
          amount: 65.99,
          dueDate: new Date(Date.now() + 1296000000).toISOString(), // 15 days from now
          daysRemaining: 15,
          icon: 'wifi',
          color: 'green',
          category: 'Internet',
          isPaid: false
        },
        {
          id: crypto.randomUUID(),
          name: 'Phone Bill',
          amount: 42.50,
          dueDate: new Date(Date.now() + 1555200000).toISOString(), // 18 days from now
          daysRemaining: 18,
          icon: 'phone',
          color: 'red',
          category: 'Phone',
          isPaid: false
        }
      ];
    } catch (error) {
      console.error('Error fetching upcoming bills:', error);
      throw new Error('Failed to fetch upcoming bills');
    }
  }
}

export const capitalOneAPI = new CapitalOneAPI();
