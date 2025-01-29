import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';

const Costs = () => {
  const { data, addCost, updateCost } = useData();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCost({
      title,
      amount: parseFloat(amount),
      dueDate,
      paid: false
    });
    setTitle('');
    setAmount('');
    setDueDate('');
    toast({
      title: "Cost Added",
      description: "The cost has been successfully added.",
    });
  };

  const togglePaid = (id: string, currentPaid: boolean) => {
    updateCost(id, { paid: !currentPaid });
    toast({
      title: currentPaid ? "Cost Marked as Unpaid" : "Cost Marked as Paid",
      description: `The cost has been marked as ${currentPaid ? 'unpaid' : 'paid'}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data do Vencimento</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
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
              <CardTitle>Para pagar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.costs.filter(cost => !cost.paid).map(cost => (
                  <div key={cost.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{cost.title}</h3>
                      <p className="text-sm text-gray-500">Vencimento: {new Date(cost.dueDate).toLocaleDateString()}</p>
                      <p className="text-red-600 font-medium">${cost.amount.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => togglePaid(cost.id, cost.paid)}
                    >
                      Marcar como paga
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.costs.filter(cost => cost.paid).map(cost => (
                  <div key={cost.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-medium">{cost.title}</h3>
                      <p className="text-sm text-gray-500">Paga em: {new Date(cost.dueDate).toLocaleDateString()}</p>
                      <p className="text-green-600 font-medium">${cost.amount.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => togglePaid(cost.id, cost.paid)}
                    >
                      Desmarcar paga
                    </Button>
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

export default Costs;