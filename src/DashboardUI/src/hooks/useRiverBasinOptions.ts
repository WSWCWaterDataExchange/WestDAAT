import { useQuery } from 'react-query';
import { getRiverBasinOptions } from '../accessors/systemAccessor';

export function useRiverBasinOptions() {
  return useQuery(
    ['riverBasinOptions'],
    async () => await getRiverBasinOptions()
  );
}
