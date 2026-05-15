import { useSelector } from 'react-redux';
import { useGetStatisticsQuery } from '../../../redux/features/services/baseApi';

export const useStatistics = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.accountType;

  const endpoint = role === 'admin' ? 'admin/statistics' : 'vendor/statistics';

  const { data, isLoading, error } = useGetStatisticsQuery(endpoint);

  return {
    stats: data?.data,
    role,
    isLoading,
    error
  };
};
