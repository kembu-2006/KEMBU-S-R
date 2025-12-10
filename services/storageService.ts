import { Contract, User, RecentAnalysis } from '../types';

const STORAGE_KEYS = {
  USERS: 'legallens_users',
  CONTRACTS: 'legallens_contracts',
  CURRENT_USER: 'legallens_current_user',
  RECENT_ANALYSES: 'legallens_recent_analyses',
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const storageService = {
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      console.error("Failed to load users from storage", e);
      return [];
    }
  },

  saveUser: (user: User) => {
    try {
      const users = storageService.getUsers();
      // Update existing user or add new one
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...user };
      } else {
        users.push(user);
      }
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save user", e);
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to load current user", e);
      return null;
    }
  },

  setCurrentUser: (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error("Failed to set current user", e);
    }
  },

  getContracts: (userId: string): Contract[] => {
    try {
      const contractsRaw = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
      const contracts: Contract[] = contractsRaw ? JSON.parse(contractsRaw) : [];
      return contracts.filter(c => c.userId === userId);
    } catch (e) {
      console.error("Failed to load contracts", e);
      return [];
    }
  },

  saveContract: async (contract: Contract) => {
    try {
      const contractsRaw = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
      const contracts: Contract[] = contractsRaw ? JSON.parse(contractsRaw) : [];
      
      const existingIndex = contracts.findIndex(c => c.id === contract.id);
      if (existingIndex >= 0) {
        contracts[existingIndex] = contract;
      } else {
        contracts.push(contract);
      }
      
      localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
    } catch (e) {
      console.error("Failed to save contract", e);
      throw e;
    }
  },

  getRecentAnalyses: (): RecentAnalysis[] => {
    try {
      const recentRaw = localStorage.getItem(STORAGE_KEYS.RECENT_ANALYSES);
      return recentRaw ? JSON.parse(recentRaw) : [];
    } catch (e) {
      console.error("Failed to load recent analyses", e);
      return [];
    }
  },

  saveRecentAnalysis: (analysis: RecentAnalysis) => {
    try {
      const recent = storageService.getRecentAnalyses();
      // Remove if exists to move to top
      const filtered = recent.filter(r => r.id !== analysis.id);
      const updated = [analysis, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem(STORAGE_KEYS.RECENT_ANALYSES, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent analysis", e);
    }
  },

  clearRecentAnalyses: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_ANALYSES);
    } catch (e) {
      console.error("Failed to clear recent analyses", e);
    }
  }
};