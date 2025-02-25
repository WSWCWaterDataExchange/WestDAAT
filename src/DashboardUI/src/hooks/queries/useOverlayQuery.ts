import { useQuery } from 'react-query';
import {
  getOverlayDetails, getOverlayDigests,
  getOverlayInfoById,
  getWaterRightsInfoListByReportingUnitUuid,
} from '../../accessors/overlaysAccessor';
import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';
import { UseQueryOptionsParameter } from '../../HelperTypes';

export function useOverlayDetails(
  overlayUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayDetails>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled !== false && !!overlayUuid,
  };

  return useQuery(['overlay.Details', overlayUuid], async () => await getOverlayDetails(overlayUuid!), setOptions);
}

export function useOverlayDigests(overlayUuid: string | undefined) {
  return useQuery(['overlay.Digests', overlayUuid], async () => await getOverlayDigests(overlayUuid!), {
    enabled: !!overlayUuid,
  });
}

export function useOverlayInfoById(
  overlayUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayTableEntry[]>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled !== false && !!overlayUuid,
  };

  return useQuery(['overlay.Rights', overlayUuid], async () => await getOverlayInfoById(overlayUuid!), setOptions);
}

export function useWaterRightsInfoListByReportingUnitUuid(
  reportingUnitUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, WaterRightsInfoListItem[]>,
) {
  const setOptions = {
    ...options,
    enabled: !!reportingUnitUuid,
  };

  return useQuery(
    ['overlay.LegalInfoList', reportingUnitUuid],
    async () => await getWaterRightsInfoListByReportingUnitUuid(reportingUnitUuid!),
    setOptions,
  );
}
