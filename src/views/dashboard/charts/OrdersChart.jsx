import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

export default function OrdersChart({ orders, todayOrders }) {
  const series = [
    {
      name: 'Orders',
      data: [todayOrders || 0, orders || 0]
    }
  ];

  const options = {
    chart: { type: 'bar' },
    xaxis: {
      categories: ['Today', 'Total']
    },
    dataLabels: { enabled: false }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">Orders Overview</Typography>

      <Chart options={options} series={series} type="bar" height={300} />
    </Card>
  );
}
