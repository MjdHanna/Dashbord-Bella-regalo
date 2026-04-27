import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';

import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

import { useGetStatisticsQuery } from '../../../../redux/features/services';

export default function Dashboard() {
  const { data, isLoading } = useGetStatisticsQuery();

  const stats = data?.data;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} total={stats?.revenue?.total} />
          </Grid>

          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} totalOrders={stats?.orders?.total} todayOrders={stats?.todayOrders?.total} />
          </Grid>

          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <TotalIncomeLightCard
              isLoading={isLoading}
              total={stats?.users?.total}
              label="Total Users"
              icon={<StorefrontTwoToneIcon fontSize="inherit" />}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12 }}>
            <TotalGrowthBarChart isLoading={isLoading} monthlySales={stats?.charts?.monthlySales} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
