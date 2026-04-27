import { useGetStatisticsQuery } from '../../../redux/features/services/baseApi';

export const useStatistics = () => {
  const { data, isLoading, error } = useGetStatisticsQuery();

  return {
    stats: data?.data,
    isLoading,
    error
  };
};
