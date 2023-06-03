import { useQuery } from 'react-query';
import { getBeneficialUses, getOwnerClassifications, getRiverBasinPolygonsByName, getStates, getWaterSourceTypes } from '../../accessors/systemAccessor';

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

export function useRiverBasinPolygons(riverBasinNames: string[]) {
  return useQuery(
    ['system.riverBasinPolygonsByName', ...[...riverBasinNames].sort()],
    () => getRiverBasinPolygonsByName(riverBasinNames),
    {enabled: riverBasinNames.length > 0});
}