export interface Cost {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  value: number;
  sold: boolean;
}

export interface Service {
  id: string;
  title: string;
  quantity: number;
  dueDate: string;
  value: number;
  paid: boolean;
}

export interface DashboardData {
  costs: Cost[];
  products: Product[];
  services: Service[];
}