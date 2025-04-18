import { 
  users, type User, type InsertUser,
  accounts, type Account, type InsertAccount,
  transactions, type Transaction, type InsertTransaction,
  spendingCategories, type SpendingCategory, type InsertSpendingCategory,
  bills, type Bill, type InsertBill,
  authStates, type AuthState, type InsertAuthState
} from "@shared/schema";

// Interface for the storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: number, tokens: Partial<User>): Promise<User>;
  
  // Auth state methods
  createAuthState(state: InsertAuthState): Promise<AuthState>;
  getAuthState(state: string): Promise<AuthState | undefined>;
  deleteAuthState(state: string): Promise<boolean>;
  
  // Account methods
  getAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  
  // Transaction methods
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Spending category methods
  getSpendingCategories(userId: number): Promise<SpendingCategory[]>;
  createSpendingCategory(category: InsertSpendingCategory): Promise<SpendingCategory>;
  
  // Bill methods
  getBills(userId: number): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: number, updates: Partial<Bill>): Promise<Bill>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private authStates: Map<string, AuthState>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  private spendingCategories: Map<number, SpendingCategory>;
  private bills: Map<number, Bill>;
  private currentIds: {
    users: number;
    accounts: number;
    transactions: number;
    spendingCategories: number;
    bills: number;
    authStates: number;
  };

  constructor() {
    this.users = new Map();
    this.authStates = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.spendingCategories = new Map();
    this.bills = new Map();
    this.currentIds = {
      users: 1,
      accounts: 1,
      transactions: 1,
      spendingCategories: 1,
      bills: 1,
      authStates: 1
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(userId: number, tokens: Partial<User>): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const updatedUser = { ...user, ...tokens };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Auth state methods
  async createAuthState(insertState: InsertAuthState): Promise<AuthState> {
    const id = this.currentIds.authStates++;
    const authState: AuthState = { 
      ...insertState, 
      id, 
      createdAt: new Date() 
    };
    this.authStates.set(authState.state, authState);
    return authState;
  }

  async getAuthState(state: string): Promise<AuthState | undefined> {
    return this.authStates.get(state);
  }

  async deleteAuthState(state: string): Promise<boolean> {
    return this.authStates.delete(state);
  }

  // Account methods
  async getAccounts(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId,
    );
  }

  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentIds.accounts++;
    const account: Account = { 
      ...insertAccount, 
      id, 
      createdAt: new Date() 
    };
    this.accounts.set(id, account);
    return account;
  }

  // Transaction methods
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId,
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transactions++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Spending category methods
  async getSpendingCategories(userId: number): Promise<SpendingCategory[]> {
    return Array.from(this.spendingCategories.values()).filter(
      (category) => category.userId === userId,
    );
  }

  async createSpendingCategory(insertCategory: InsertSpendingCategory): Promise<SpendingCategory> {
    const id = this.currentIds.spendingCategories++;
    const category: SpendingCategory = { 
      ...insertCategory, 
      id, 
      createdAt: new Date() 
    };
    this.spendingCategories.set(id, category);
    return category;
  }

  // Bill methods
  async getBills(userId: number): Promise<Bill[]> {
    return Array.from(this.bills.values()).filter(
      (bill) => bill.userId === userId,
    );
  }

  async getBill(id: number): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = this.currentIds.bills++;
    const bill: Bill = { 
      ...insertBill, 
      id, 
      createdAt: new Date() 
    };
    this.bills.set(id, bill);
    return bill;
  }

  async updateBill(id: number, updates: Partial<Bill>): Promise<Bill> {
    const bill = await this.getBill(id);
    if (!bill) {
      throw new Error(`Bill with id ${id} not found`);
    }

    const updatedBill = { ...bill, ...updates };
    this.bills.set(id, updatedBill);
    return updatedBill;
  }
}

export const storage = new MemStorage();
