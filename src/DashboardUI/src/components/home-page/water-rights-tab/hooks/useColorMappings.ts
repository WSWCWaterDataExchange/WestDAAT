import { useCallback, useMemo } from "react";
import { useWaterRightsContext } from "../Provider";
import { useColorMappings as useColorMappingsBase } from "../../../../hooks/useColorMappings"

export function useColorMappings() {
    const { 
      state: {
        beneficialUsesQuery: {data: allBeneficialUses},
        ownerClassificationsQuery: {data: allOwnerClassifications},
        waterSourcesQuery: {data: allWaterSourceTypes}
      }
    } = useWaterRightsContext();

    const {fallbackColor, getColorByIndex} = useColorMappingsBase();

    const beneficialUseColors = useMemo(()=>{
      let colorIndex = 0;
      return allBeneficialUses?.map(a => ({ key: a.beneficialUseName, color: getColorByIndex(colorIndex++) })) ?? [];
    }, [allBeneficialUses, getColorByIndex]);

    const ownerClassificationColors = useMemo(()=>{
      let colorIndex = 0;
      return allOwnerClassifications?.map(a => ({ key: a, color: getColorByIndex(colorIndex++) })) ?? [];
    }, [allOwnerClassifications, getColorByIndex]);

    const waterSourceTypeColors = useMemo(()=>{
      let colorIndex = 0;
      return allWaterSourceTypes?.map(a => ({ key: a, color: getColorByIndex(colorIndex++) })) ?? [];
    }, [allWaterSourceTypes, getColorByIndex]);

    const getBeneficialUseColor = useCallback((beneficialUseName: string) =>{
      return beneficialUseColors.find(item => item.key === beneficialUseName)?.color ?? fallbackColor
    }, [beneficialUseColors, fallbackColor])

    const getOwnerClassificationColor = useCallback((ownerClassification: string) =>{
      return ownerClassificationColors.find(item => item.key === ownerClassification)?.color ?? fallbackColor
    }, [ownerClassificationColors, fallbackColor])

    const getWaterSourceTypeColor = useCallback((waterSourceType: string) =>{
      return waterSourceTypeColors.find(item => item.key === waterSourceType)?.color ?? fallbackColor
    }, [waterSourceTypeColors, fallbackColor])

    return {beneficialUseColors, ownerClassificationColors, waterSourceTypeColors, getBeneficialUseColor, getOwnerClassificationColor, getWaterSourceTypeColor, fallbackColor}
}