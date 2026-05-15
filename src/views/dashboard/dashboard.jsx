import { Grid } from '@mui/material';
import { useStatistics } from './hooks/useStatistics';
import StatsCharts from './components/StatsCards';
import RevenueChart from './charts/RevenueChart';
import OrdersChart from './charts/OrdersChart';
import MonthlySalesChart from './charts/MonthlySalesChart';
export default function Dashboard() {
  const { stats, role, isLoading } = useStatistics();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StatsCharts stats={stats} role={role} />
      </Grid>

      <Grid item xs={12} md={6}>
        <RevenueChart revenue={stats?.revenue?.total} todayRevenue={stats?.todayRevenue?.total} />
      </Grid>

      <Grid item xs={12} md={6}>
        <OrdersChart orders={stats?.orders?.total} todayOrders={stats?.todayOrders?.total} />
      </Grid>

      <Grid item xs={12}>
        <MonthlySalesChart data={stats?.charts?.monthlySales || []} />
      </Grid>
    </Grid>
  );
}
