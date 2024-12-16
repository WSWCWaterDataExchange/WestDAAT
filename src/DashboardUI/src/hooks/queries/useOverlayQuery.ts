import { useQuery } from 'react-query';
import { getOverlayDetails } from '../../accessors/waterAllocationAccessor';
import { OverlayDetails } from '@data-contracts';
import { UseQueryOptionsParameter } from '../../HelperTypes';

export function useOverlayDetails(
  overlayUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayDetails>
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled !== false && !!overlayUuid,
  };

  return useQuery(
    ['overlay.Details', overlayUuid],
    async () => await getOverlayDetails(overlayUuid!),
    setOptions
  );
}
