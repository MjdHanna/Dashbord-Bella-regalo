import { Typography, Card, Grid } from '@mui/material';
import Chart from 'react-apexcharts';
export default function StatsCharts({ stats, role }) {
  const charts =
    role === 'admin'
      ? [
          {
            label: 'Users',
            value: stats?.users?.total || 0,
            color: '#5e35b1'
          },
          {
            label: 'Vendors',
            value: stats?.vendors?.total || 0,
            color: '#00acc1'
          },
          {
            label: 'Orders',
            value: stats?.orders?.total || 0,
            color: '#43a047'
          }
        ]
      : [
          {
            label: 'Products',
            value: stats?.totalProducts?.Products || 0,
            color: '#5e35b1'
          },
          {
            label: 'Low Stock',
            value: stats?.lowStock?.lowStockProducts || 0,
            color: '#ff9800'
          },
          {
            label: 'Pending Orders',
            value: stats?.pending?.pendingOrders || 0,
            color: '#43a047'
          }
        ];

  return (
    <Grid container spacing={2}>
      {charts.map((item) => (
        <Grid item xs={12} md={4} key={item.label}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{item.label}</Typography>

            <Chart
              type="radialBar"
              height={250}
              series={[item.value]}
              options={{
                chart: { sparkline: { enabled: true } },
                plotOptions: {
                  radialBar: {
                    hollow: { size: '60%' },
                    dataLabels: {
                      name: { show: false },
                      value: {
                        fontSize: '22px',
                        formatter: () => item.value
                      }
                    }
                  }
                },
                colors: [item.color]
              }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
