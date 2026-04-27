import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

export default function RevenueChart({ revenue, todayRevenue }) {
  const series = [
    {
      name: 'Revenue',
      data: [Number(revenue || 0), Number(todayRevenue || 0)]
    }
  ];

  const options = {
    chart: { type: 'area', toolbar: { show: false } },
    xaxis: {
      categories: ['Total', 'Today']
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">Revenue Overview</Typography>

      <Chart options={options} series={series} type="area" height={300} />
    </Card>
  );
}
