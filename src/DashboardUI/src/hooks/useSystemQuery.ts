import { useQuery } from 'react-query';
import { getBeneficialUses, getOwnerClassifications, getStates, getWaterSourceTypes } from '../accessors/systemAccessor';

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

