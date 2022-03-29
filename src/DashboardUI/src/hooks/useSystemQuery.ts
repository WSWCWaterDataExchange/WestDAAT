import { useQuery } from 'react-query';
import { getBeneficialUses, getOwnerClassifications, getStates, getWaterSourceTypes } from '../accessors/systemAccessor';

export function useBeneficialUses() {
  return useQuery(
    ['system.beneficialUses'],
    getBeneficialUses,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    });
}

export function useWaterSourceTypes() {
  return useQuery(
    ['system.waterSourceTypes'],
    getWaterSourceTypes,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    });
}

export function useOwnerClassifications() {
  return useQuery(
    ['system.ownerClassifications'],
    getOwnerClassifications,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    });
}

export function useStates() {
  return useQuery(
    ['system.states'],
    getStates,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    });
}

