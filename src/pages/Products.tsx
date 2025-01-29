import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';

const Products = () => {
  const { data, addProduct, updateProduct } = useData();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      stock: parseInt(stock),
      value: parseFloat(value),
      sold: false
    });
    setName('');
    setStock('');
    setValue('');
    toast({
      title: "Product Added",
      description: "The product has been successfully added.",
    });
  };

  const markAsSold = (id: string) => {
    updateProduct(id, { sold: true });
    toast({
      title: "Product Marked as Sold",
      description: "The product has been marked as sold.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estoque</label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  min="0"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <Button type="submit">Adicionar</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Em estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.products.filter(product => !product.sold).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      <p className="font-medium">${product.value.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => markAsSold(product.id)}
                    >
                      Marcar como vendido
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.products.filter(product => product.sold).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">Estoque: {product.stock}</p>
                      <p className="text-green-600 font-medium">${product.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;