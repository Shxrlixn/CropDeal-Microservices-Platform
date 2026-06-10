export interface Crop {
  id?: string;
  farmerId: string;
  cropType: string;
  cropName: string;
  name?: string;
  quantity: number;
  price: number;
  status: string;
  location: string;
  category?: string;
}

export interface Receipt {
  id?: string;
  cropId: string;
  farmerId: string;
  amount: number;
  date: string;
}
