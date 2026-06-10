export interface User {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'FARMER' | 'DEALER';
  status?: string;
}

export interface AuthResponse {
  token: string;
}

export interface BankDetails {
  id?: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}
