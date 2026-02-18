export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  isApproved: boolean; // Account/signup approved
  isVerified: boolean;
  loanTypeApproved: boolean; // Loan type/reason approved
  hasSubmittedLoanType: boolean; // Has submitted loan type documents
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  pin: string;
  documentUri?: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  pin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
