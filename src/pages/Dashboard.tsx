import DashboardLayout from '../components/DashboardLayout';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { data } = useData();

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
    </DashboardLayout>
  );
};

export default Dashboard;