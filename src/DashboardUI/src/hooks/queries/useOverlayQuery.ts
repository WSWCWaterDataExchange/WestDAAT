import { useQuery } from 'react-query';
import {
  getOverlayDetails, getOverlayDigests,
  getOverlayInfoList, getOverlayWaterRightInfoList,
} from '../../accessors/overlaysAccessor';
import { OverlayDetails, OverlayTableEntry, OverlayInfoListItem } from '@data-contracts';
import { UseQueryOptionsParameter } from '../../HelperTypes';

export function useOverlayDetails(
  overlayUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayDetails>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!overlayUuid,
  };

  return useQuery(['overlay.Details', overlayUuid], async () => await getOverlayDetails(overlayUuid!), setOptions);
}

export function useOverlayDigests(overlayUuid: string | undefined) {
  return useQuery(['overlay.Digests', overlayUuid], async () => await getOverlayDigests(overlayUuid!), {
    enabled: !!overlayUuid,
  });
}

export function useOverlayWaterRightInfoList(
  overlayUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayTableEntry[]>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!overlayUuid,
  };

  return useQuery(['overlay.Rights', overlayUuid], async () => await getOverlayWaterRightInfoList(overlayUuid!), setOptions);
}

export function useOverlayInfoList(
  reportingUnitUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayInfoListItem[]>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!reportingUnitUuid,
  };

  return useQuery(
    ['overlay.LegalInfoList', reportingUnitUuid],
    async () => await getOverlayInfoList(reportingUnitUuid!),
    setOptions,
  );
}
