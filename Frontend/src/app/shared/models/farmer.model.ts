export interface Farmer {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  aadharNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  status?: string;
  rating?: number;
}
