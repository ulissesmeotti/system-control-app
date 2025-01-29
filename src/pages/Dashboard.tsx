import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
  const { data } = useData();

  // Calculate totals as before
  const totalUnpaidCosts = data.costs
    .filter(cost => !cost.paid)
    .reduce((sum, cost) => sum + cost.amount, 0);

  const totalPaidCosts = data.costs
    .filter(cost => cost.paid)
    .reduce((sum, cost) => sum + cost.amount, 0);

  const totalProductValue = data.products
    .filter(product => !product.sold)
    .reduce((sum, product) => sum + (product.value * product.stock), 0);

  const totalSoldValue = data.products
    .filter(product => product.sold)
    .reduce((sum, product) => sum + product.value, 0);

  const totalServiceValue = data.services
    .filter(service => !service.paid)
    .reduce((sum, service) => sum + (service.value * service.quantity), 0);

  const totalPaidServices = data.services
    .filter(service => service.paid)
    .reduce((sum, service) => sum + (service.value * service.quantity), 0);

  // Prepare data for monthly chart
  const getMonthlyData = () => {
    const monthlyData: { name: string; costs: number; revenue: number; }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach((month, index) => {
      const monthCosts = data.costs
        .filter(cost => {
          const costDate = new Date(cost.dueDate);
          return costDate.getMonth() === index && cost.paid;
        })
        .reduce((sum, cost) => sum + cost.amount, 0);

      const monthProductRevenue = data.products
        .filter(product => {
          const soldDate = new Date();  // In a real app, we'd store the sold date
          return soldDate.getMonth() === index && product.sold;
        })
        .reduce((sum, product) => sum + product.value, 0);

      const monthServiceRevenue = data.services
        .filter(service => {
          const paidDate = new Date(service.dueDate);
          return paidDate.getMonth() === index && service.paid;
        })
        .reduce((sum, service) => sum + (service.value * service.quantity), 0);

      monthlyData.push({
        name: month,
        costs: monthCosts,
        revenue: monthProductRevenue + monthServiceRevenue,
      });
    });

    return monthlyData;
  };

  // Prepare data for revenue distribution pie chart
  const revenueDistribution = [
    { name: 'Products', value: totalSoldValue },
    { name: 'Services', value: totalPaidServices },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Custos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Para pagar:</span>
                <span className="font-semibold text-red-600">
                  ${totalUnpaidCosts.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pagos:</span>
                <span className="font-semibold text-green-600">
                  ${totalPaidCosts.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor em Estoque:</span>
                <span className="font-semibold">
                  ${totalProductValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valor Vendido:</span>
                <span className="font-semibold text-green-600">
                  ${totalSoldValue.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços Feitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pendentes:</span>
                <span className="font-semibold">
                  ${totalServiceValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completos:</span>
                <span className="font-semibold text-green-600">
                  ${totalPaidServices.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total do Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer
              className="h-[300px]"
              config={{
                costs: {
                  theme: {
                    light: "#ef4444",
                    dark: "#ef4444",
                  },
                },
                revenue: {
                  theme: {
                    light: "#22c55e",
                    dark: "#22c55e",
                  },
                },
              }}
            >
              <LineChart data={getMonthlyData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Line type="monotone" dataKey="costs" stroke="#ef4444" name="Costs" />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
  <CardHeader>
    <CardTitle>Distribuição do faturamento</CardTitle>
  </CardHeader>
  <CardContent className="flex h-[400px]">
    {/* Gráfico de pizza */}
    <div className="w-1/2 h-full">
      <ChartContainer
        className="h-[300px]"
        config={{
          products: {
            theme: {
              light: "#0088FE",
              dark: "#0088FE",
            },
          },
          services: {
            theme: {
              light: "#00C49F",
              dark: "#00C49F",
            },
          },
        }}
      >
        <PieChart>
          <Pie
            data={revenueDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {revenueDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip />
        </PieChart>
      </ChartContainer>
    </div>

    {/* Detalhes das vendas/serviços */}
    <div className="w-1/2 h-full pl-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-2">Detalhes do faturamento</h3>
      <ul className="space-y-2">
        {revenueDistribution.map((item, index) => (
          <li key={index} className="flex items-start">
            <span
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </CardContent>
</Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;