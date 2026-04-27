import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

export default function MonthlySalesChart({ data }) {
  const series = [
    {
      name: 'Revenue',
      data: data?.map((i) => Number(i.total)) || []
    }
  ];

  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: {
      categories: data?.map((i) => `Month ${i.month}`) || []
    },
    dataLabels: { enabled: false }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">Monthly Sales</Typography>

      <Chart options={options} series={series} type="bar" height={350} />
    </Card>
  );
}
