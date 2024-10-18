import { useQuery } from "react-query";
import {
  getRegulationDetails,
  getRegulatoryOverlayInfoList,
} from "../../accessors/regulationAccessor";
import { UseQueryOptionsParameter } from "../../HelperTypes";
import { RegulatoryOverlayInfoListItem } from "@data-contracts";

export function useRegulationDetails(areaUuid: string | undefined) {
  return useQuery(
    ["regulation.Details", areaUuid],
    async () => await getRegulationDetails(areaUuid!),
    {
      enabled: !!areaUuid,
    },
  );
}

type RegulatoryOverlayInfoListOptionsType = UseQueryOptionsParameter<
  undefined,
  RegulatoryOverlayInfoListItem[]
>;

export function useRegulatoryOverlayInfoList(
  areaUuid: string | undefined,
  options?: RegulatoryOverlayInfoListOptionsType,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!areaUuid,
  };
  return useQuery(
    ["regulation.RegulatoryOverlayInfoList", areaUuid],
    async () => await getRegulatoryOverlayInfoList(areaUuid!),
    setOptions,
  );
}
