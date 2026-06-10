export interface Order {
  id?: string;
  cropId: string;
  dealerId: string;
  farmerId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface Payment {
  id?: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: string;
}
