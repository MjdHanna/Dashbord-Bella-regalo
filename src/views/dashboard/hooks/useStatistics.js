import { useSelector } from 'react-redux';
import { useGetStatisticsQuery } from '../../../redux/features/services/baseApi';

export const useStatistics = () => {
  const user = useSelector((state) => state.auth.user);

  const role = user?.accountType;

  const { data, isLoading, error } = useGetStatisticsQuery(role);

  return {
    stats: data?.data,
    role,
    isLoading,
    error
  };
};
