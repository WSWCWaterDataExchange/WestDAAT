import { useCallback, useMemo } from "react";
import { useSiteSpecificContext } from "../Provider";
import { useColorMappings as useColorMappingsBase } from "../../../../hooks/useColorMappings"

export function useColorMappings() {
    const { 
      hostData: {
        beneficialUsesQuery: {data: allBeneficialUses},
        waterSourcesQuery: {data: allWaterSourceTypes}
      }
    } = useSiteSpecificContext();

    const {fallbackColor, getColorByIndex} = useColorMappingsBase();

    const beneficialUseColors = useMemo(()=>{
      let colorIndex = 0;
      return allBeneficialUses?.map(a => ({ key: a.beneficialUseName, color: getColorByIndex(colorIndex++) })) ?? [];
    }, [allBeneficialUses, getColorByIndex]);

    const waterSourceTypeColors = useMemo(()=>{
      let colorIndex = 0;
      return allWaterSourceTypes?.map(a => ({ key: a, color: getColorByIndex(colorIndex++) })) ?? [];
    }, [allWaterSourceTypes, getColorByIndex]);

    const getBeneficialUseColor = useCallback((beneficialUseName: string) =>{
      return beneficialUseColors.find(item => item.key === beneficialUseName)?.color ?? fallbackColor
    }, [beneficialUseColors, fallbackColor])

    const getWaterSourceTypeColor = useCallback((waterSourceType: string) =>{
      return waterSourceTypeColors.find(item => item.key === waterSourceType)?.color ?? fallbackColor
    }, [waterSourceTypeColors, fallbackColor])

    return {beneficialUseColors, waterSourceTypeColors, getBeneficialUseColor, getWaterSourceTypeColor, fallbackColor}
}