import { useQuery } from 'react-query';
import {
  getAllocationTypes,
  getBeneficialUses, getLegalStatuses,
  getOwnerClassifications,
  getRiverBasinPolygonsByName, getSiteTypes,
  getStates,
  getWaterSourceTypes
} from '../../accessors/systemAccessor';

export function useBeneficialUses() {
  return useQuery(
    ['system.beneficialUses'],
    getBeneficialUses);
}

export function useWaterSourceTypes() {
  return useQuery(
    ['system.waterSourceTypes'],
    getWaterSourceTypes);
}

export function useOwnerClassifications() {
  return useQuery(
    ['system.ownerClassifications'],
    getOwnerClassifications);
}

export function useStates() {
  return useQuery(
    ['system.states'],
    getStates);
}

export function useAllocationTypes() {
  return useQuery(
      ['system.allocationTypes'],
      getAllocationTypes
  );
}

export function useLegalStatuses() {
  return useQuery(
      ['system.legalstatuses'],
      getLegalStatuses
  );
}

export function useSiteTypes(){
  return useQuery(
      ['system.sitetypes'],
      getSiteTypes
  );
}

export function useRiverBasinPolygons(riverBasinNames: string[]) {
  return useQuery(
    ['system.riverBasinPolygonsByName', ...[...riverBasinNames].sort()],
    () => getRiverBasinPolygonsByName(riverBasinNames),
    {enabled: riverBasinNames.length > 0});
}