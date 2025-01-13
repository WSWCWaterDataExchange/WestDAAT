import { useQuery } from 'react-query';
import {
  getOverlayDetails,
  getOverlayInfoById,
  getWaterRightsInfoListByAllocationUuid,
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
    enabled: options?.enabled !== false && !!reportingUnitUuid,
  };

  return useQuery(
    ['overlay.Legal', reportingUnitUuid],
    async () => await getWaterRightsInfoListByReportingUnitUuid(reportingUnitUuid!),
    setOptions,
  );
}

export function useWaterRightsInfoListByAllocationUuid(
  allocationUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, WaterRightsInfoListItem[]>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled !== false && !!allocationUuid,
  };

  return useQuery(
    ['overlay.Legal', allocationUuid],
    async () => await getWaterRightsInfoListByAllocationUuid(allocationUuid!),
    setOptions,
  );
}
