import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  approveSignup: () => void;
  approveLoanType: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, pin: string) => {
    try {
      const mockUser: User = {
        id: '1',
        firstName: 'Maria',
        lastName: 'Santos',
        phoneNumber,
        address: 'Sample Address',
        isApproved: false,
        isVerified: true,
        loanTypeApproved: false,
        hasSubmittedLoanType: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      const mockUser: User = {
        id: '1',
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        isApproved: false,
        isVerified: false,
        loanTypeApproved: false,
        hasSubmittedLoanType: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  };

  const approveSignup = () => {
    console.log('[AuthContext] approveSignup called, current user:', user);
    setUser(prevUser => {
      if (!prevUser) {
        console.log('[AuthContext] No user to approve');
        return null;
      }
      const updatedUser = { ...prevUser, isApproved: true };
      console.log('[AuthContext] User approved, new user:', updatedUser);
      return updatedUser;
    });
  };

  const approveLoanType = () => {
    console.log('[AuthContext] approveLoanType called, current user:', user);
    setUser(prevUser => {
      if (!prevUser) {
        console.log('[AuthContext] No user to approve loan type');
        return null;
      }
      const updatedUser = { ...prevUser, loanTypeApproved: true };
      console.log('[AuthContext] Loan type approved, new user:', updatedUser);
      return updatedUser;
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    updateUser,
    approveSignup,
    approveLoanType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
