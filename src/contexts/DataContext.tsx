import { createContext, useContext, useState, useEffect } from 'react';
import { DashboardData, Cost, Product, Service } from '../types/dashboard';

interface DataContextType {
  data: DashboardData;
  addCost: (cost: Omit<Cost, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateCost: (id: string, updates: Partial<Cost>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
}

const initialData: DashboardData = {
  costs: [],
  products: [],
  services: []
};

const DataContext = createContext<DataContextType>({
  data: initialData,
  addCost: () => {},
  addProduct: () => {},
  addService: () => {},
  updateCost: () => {},
  updateProduct: () => {},
  updateService: () => {}
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const saveData = (newData: DashboardData) => {
    localStorage.setItem('dashboardData', JSON.stringify(newData));
    setData(newData);
  };

  const addCost = (cost: Omit<Cost, 'id'>) => {
    const newCost = { ...cost, id: Date.now().toString() };
    saveData({ ...data, costs: [...data.costs, newCost] });
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    saveData({ ...data, products: [...data.products, newProduct] });
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    saveData({ ...data, services: [...data.services, newService] });
  };

  const updateCost = (id: string, updates: Partial<Cost>) => {
    const newCosts = data.costs.map(cost => 
      cost.id === id ? { ...cost, ...updates } : cost
    );
    saveData({ ...data, costs: newCosts });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const newProducts = data.products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    saveData({ ...data, products: newProducts });
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const newServices = data.services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    );
    saveData({ ...data, services: newServices });
  };

  return (
    <DataContext.Provider value={{
      data,
      addCost,
      addProduct,
      addService,
      updateCost,
      updateProduct,
      updateService
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);