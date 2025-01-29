import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

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
            <CardTitle>Costs Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>To be paid:</span>
                <span className="font-semibold text-red-600">
                  ${totalUnpaidCosts.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="font-semibold text-green-600">
                  ${totalPaidCosts.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>In Stock Value:</span>
                <span className="font-semibold">
                  ${totalProductValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sold Value:</span>
                <span className="font-semibold text-green-600">
                  ${totalSoldValue.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold">
                  ${totalServiceValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
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
            <CardTitle>Monthly Overview</CardTitle>
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
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;