import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

export interface Group {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  centerLocation: string;
  meetingDay: string;
  meetingTime: string;
  members: GroupMember[];
  maxMembers: number;
  createdAt: Date;
  status: 'active' | 'pending' | 'full';
}

export interface GroupMember {
  userId: string;
  name: string;
  phoneNumber: string;
  joinedAt: Date;
  status: 'active' | 'pending';
  loanAmount?: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  term: number; // weeks
  loanType: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  weeklyPayment: number;
  totalRepayment: number;
  appliedAt: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
}

export interface PaymentSchedule {
  id: string;
  loanId: string;
  weekNumber: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: Date;
  paidAmount?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'loan_disbursement' | 'loan_payment' | 'savings_deposit' | 'savings_withdrawal' | 'insurance_payment';
  amount: number;
  date: Date;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface SavingsAccount {
  id: string;
  userId: string;
  balance: number;
  status: 'pending' | 'active';
  createdAt: Date;
}

export interface InsuranceAccount {
  id: string;
  userId: string;
  plan: string;
  premium: number;
  status: 'pending' | 'active';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userGroup: Group | null;
  allGroups: Group[];
  loanApplication: LoanApplication | null;
  paymentSchedules: PaymentSchedule[];
  transactions: Transaction[];
  savingsAccount: SavingsAccount | null;
  insuranceAccount: InsuranceAccount | null;
  login: (phoneNumber: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  approveSignup: () => void;
  approveLoanType: () => void;
  createGroup: (groupData: Omit<Group, 'id' | 'leaderId' | 'leaderName' | 'members' | 'createdAt' | 'status'>) => void;
  joinGroup: (groupId: string) => void;
  approveGroupMember: (groupId: string, userId: string) => void;
  submitLoanApplication: (amount: number, term: number, loanType: string) => void;
  approveLoan: () => void;
  createSavingsAccount: () => void;
  createInsuranceAccount: (plan: string, premium: number) => void;
  makePayment: (scheduleId: string, amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<Group | null>(null);
  const [loanApplication, setLoanApplication] = useState<LoanApplication | null>(null);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsAccount, setSavingsAccount] = useState<SavingsAccount | null>(null);
  const [insuranceAccount, setInsuranceAccount] = useState<InsuranceAccount | null>(null);
  const [allGroups, setAllGroups] = useState<Group[]>([
    // Mock groups for testing
    {
      id: 'group-1',
      name: 'Sampaguita Group',
      leaderId: 'leader-1',
      leaderName: 'Maria Santos',
      centerLocation: 'Barangay Hall, Brgy. San Jose',
      meetingDay: 'Tuesday',
      meetingTime: '9:00 AM',
      members: [
        {
          userId: 'leader-1',
          name: 'Maria Santos',
          phoneNumber: '09171234567',
          joinedAt: new Date(),
          status: 'active',
        },
      ],
      maxMembers: 15,
      createdAt: new Date(),
      status: 'active',
    },
    {
      id: 'group-2',
      name: 'Gumamela Group',
      leaderId: 'leader-2',
      leaderName: 'Ana Cruz',
      centerLocation: 'Community Center, Brgy. Santa Maria',
      meetingDay: 'Thursday',
      meetingTime: '2:00 PM',
      members: Array.from({ length: 12 }, (_, i) => ({
        userId: `member-${i}`,
        name: `Member ${i + 1}`,
        phoneNumber: `0917000000${i}`,
        joinedAt: new Date(),
        status: 'active' as const,
      })),
      maxMembers: 15,
      createdAt: new Date(),
      status: 'active',
    },
    {
      id: 'group-3',
      name: 'Rosal Group',
      leaderId: 'leader-3',
      leaderName: 'Linda Reyes',
      centerLocation: 'Covered Court, Brgy. San Pedro',
      meetingDay: 'Wednesday',
      meetingTime: '10:00 AM',
      members: Array.from({ length: 15 }, (_, i) => ({
        userId: `member-${i}`,
        name: `Member ${i + 1}`,
        phoneNumber: `0917000000${i}`,
        joinedAt: new Date(),
        status: 'active' as const,
      })),
      maxMembers: 15,
      createdAt: new Date(),
      status: 'full',
    },
  ]);

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

  const createGroup = (groupData: Omit<Group, 'id' | 'leaderId' | 'leaderName' | 'members' | 'createdAt' | 'status'>) => {
    if (!user) {
      console.log('[AuthContext] createGroup - No user logged in');
      return;
    }

    console.log('[AuthContext] createGroup called with data:', groupData);

    const newGroup: Group = {
      ...groupData,
      id: `group-${Date.now()}`,
      leaderId: user.id,
      leaderName: `${user.firstName} ${user.lastName}`,
      members: [
        {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          phoneNumber: user.phoneNumber,
          joinedAt: new Date(),
          status: 'active',
        },
      ],
      createdAt: new Date(),
      status: 'active',
    };

    console.log('[AuthContext] New group created:', newGroup);

    setAllGroups(prev => [...prev, newGroup]);
    setUserGroup(newGroup);

    console.log('[AuthContext] User is now group leader of:', newGroup.name);
  };

  const joinGroup = (groupId: string) => {
    if (!user) {
      console.log('[AuthContext] joinGroup - No user logged in');
      return;
    }

    console.log('[AuthContext] joinGroup called for groupId:', groupId);

    const group = allGroups.find(g => g.id === groupId);
    if (!group) {
      console.log('[AuthContext] Group not found:', groupId);
      return;
    }

    if (group.members.length >= group.maxMembers) {
      console.log('[AuthContext] Group is full:', group.name);
      return;
    }

    const newMember: GroupMember = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      joinedAt: new Date(),
      status: 'pending', // Requires leader approval
    };

    console.log('[AuthContext] Adding member to group:', newMember);

    setAllGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, members: [...g.members, newMember] }
          : g
      )
    );

    console.log('[AuthContext] Join request sent to group:', group.name);
  };

  const approveGroupMember = (groupId: string, userId: string) => {
    console.log('[AuthContext] approveGroupMember called for groupId:', groupId, 'userId:', userId);

    setAllGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map(m =>
                m.userId === userId ? { ...m, status: 'active' as const } : m
              ),
            }
          : g
      )
    );

    // Update userGroup if it's the current user's group
    if (userGroup?.id === groupId) {
      setUserGroup(prev =>
        prev
          ? {
              ...prev,
              members: prev.members.map(m =>
                m.userId === userId ? { ...m, status: 'active' as const } : m
              ),
            }
          : null
      );
    }

    console.log('[AuthContext] Member approved in group');
  };

  const submitLoanApplication = (amount: number, term: number, loanType: string) => {
    if (!user) {
      console.log('[AuthContext] submitLoanApplication - No user logged in');
      return;
    }

    console.log('[AuthContext] submitLoanApplication called');
    console.log('[AuthContext] Amount:', amount, 'Term:', term, 'Type:', loanType);

    const interestRate = 0.02; // 2% per week
    const totalInterest = amount * interestRate * term;
    const totalRepayment = amount + totalInterest;
    const weeklyPayment = totalRepayment / term;

    const newLoan: LoanApplication = {
      id: `loan-${Date.now()}`,
      userId: user.id,
      amount,
      term,
      loanType,
      status: 'pending',
      weeklyPayment,
      totalRepayment,
      appliedAt: new Date(),
    };

    console.log('[AuthContext] Loan application created:', newLoan);
    setLoanApplication(newLoan);
    updateUser({ hasSubmittedLoanType: true });
  };

  const approveLoan = () => {
    console.log('[AuthContext] approveLoan called');
    
    if (!loanApplication) {
      console.log('[AuthContext] No loan application to approve');
      return;
    }

    const approvedLoan: LoanApplication = {
      ...loanApplication,
      status: 'approved',
      approvedAt: new Date(),
    };

    console.log('[AuthContext] Loan approved:', approvedLoan);
    setLoanApplication(approvedLoan);
    updateUser({ loanTypeApproved: true });

    // Create payment schedules
    const schedules: PaymentSchedule[] = [];
    const startDate = new Date();
    
    for (let i = 1; i <= loanApplication.term; i++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (i * 7)); // Add weeks

      schedules.push({
        id: `schedule-${loanApplication.id}-${i}`,
        loanId: loanApplication.id,
        weekNumber: i,
        dueDate,
        amount: loanApplication.weeklyPayment,
        status: 'pending',
      });
    }

    console.log('[AuthContext] Payment schedules created:', schedules.length, 'payments');
    setPaymentSchedules(schedules);

    // Add disbursement transaction
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: user?.id || '',
      type: 'loan_disbursement',
      amount: loanApplication.amount,
      date: new Date(),
      description: `Loan disbursement - ${loanApplication.loanType}`,
      status: 'completed',
    };

    console.log('[AuthContext] Disbursement transaction created');
    setTransactions(prev => [transaction, ...prev]);
  };

  const createSavingsAccount = () => {
    if (!user) {
      console.log('[AuthContext] createSavingsAccount - No user logged in');
      return;
    }

    console.log('[AuthContext] createSavingsAccount called');

    const newSavings: SavingsAccount = {
      id: `savings-${Date.now()}`,
      userId: user.id,
      balance: 0,
      status: 'active',
      createdAt: new Date(),
    };

    console.log('[AuthContext] Savings account created:', newSavings);
    setSavingsAccount(newSavings);
  };

  const createInsuranceAccount = (plan: string, premium: number) => {
    if (!user) {
      console.log('[AuthContext] createInsuranceAccount - No user logged in');
      return;
    }

    console.log('[AuthContext] createInsuranceAccount called');
    console.log('[AuthContext] Plan:', plan, 'Premium:', premium);

    const newInsurance: InsuranceAccount = {
      id: `insurance-${Date.now()}`,
      userId: user.id,
      plan,
      premium,
      status: 'active',
      createdAt: new Date(),
    };

    console.log('[AuthContext] Insurance account created:', newInsurance);
    setInsuranceAccount(newInsurance);
  };

  const makePayment = (scheduleId: string, amount: number) => {
    console.log('[AuthContext] makePayment called for schedule:', scheduleId, 'amount:', amount);

    setPaymentSchedules(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              status: 'paid' as const,
              paidAt: new Date(),
              paidAmount: amount,
            }
          : schedule
      )
    );

    // Add payment transaction
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: user?.id || '',
      type: 'loan_payment',
      amount,
      date: new Date(),
      description: `Loan payment - Week ${paymentSchedules.find(s => s.id === scheduleId)?.weekNumber}`,
      status: 'completed',
    };

    console.log('[AuthContext] Payment transaction created');
    setTransactions(prev => [transaction, ...prev]);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    userGroup,
    allGroups,
    loanApplication,
    paymentSchedules,
    transactions,
    savingsAccount,
    insuranceAccount,
    login,
    logout,
    signup,
    updateUser,
    approveSignup,
    approveLoanType,
    createGroup,
    joinGroup,
    approveGroupMember,
    submitLoanApplication,
    approveLoan,
    createSavingsAccount,
    createInsuranceAccount,
    makePayment,
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
