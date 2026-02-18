export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  loanType: LoanType;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  verificationDocumentUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanVerification {
  documentUri: string;
  loanType: LoanType;
  documentType: 'business_permit' | 'business_registration' | 'proof_of_business' | 'medical_documents' | 'education_documents' | 'other';
  notes?: string;
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum LoanType {
  BUSINESS = 'business',
  MEDICAL = 'medical',
  EDUCATION = 'education',
  EMERGENCY = 'emergency',
  HOME_IMPROVEMENT = 'home_improvement',
  OTHER = 'other',
}
