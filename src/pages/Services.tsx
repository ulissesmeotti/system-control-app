import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Services = () => {
  const { data, addService, updateService } = useData();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      title,
      quantity: parseInt(quantity),
      value: parseFloat(value),
      dueDate,
      paid: false
    });
    setTitle('');
    setQuantity('');
    setValue('');
    setDueDate('');
    toast({
      title: "Service Added",
      description: "The service has been successfully added.",
    });
  };

  const markAsPaid = (id: string) => {
    updateService(id, { paid: true });
    toast({
      title: "Service Marked as Paid",
      description: "The service has been marked as paid.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Value per Unit</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit">Add Service</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.services.filter(service => !service.paid).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {service.quantity} | Due: {new Date(service.dueDate).toLocaleDateString()}
                      </p>
                      <p className="font-medium">
                        ${service.value.toFixed(2)} x {service.quantity} = ${(service.value * service.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => markAsPaid(service.id)}
                    >
                      Mark as Paid
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.services.filter(service => service.paid).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {service.quantity} | Completed: {new Date(service.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-green-600 font-medium">
                        ${service.value.toFixed(2)} x {service.quantity} = ${(service.value * service.quantity).toFixed(2)}
                      </p>
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

export default Services;