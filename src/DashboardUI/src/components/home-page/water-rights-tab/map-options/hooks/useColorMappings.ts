import { useCallback, useMemo } from 'react';
import { useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';
import { useColorMappings as useColorMappingsBase } from '../../../../../hooks/useColorMappings';
import { useOverlaysContext } from '../../sidebar-filtering/OverlaysProvider';

export function useColorMappings() {
  const {
    hostData: {
      beneficialUsesQuery: { data: allBeneficialUses },
      ownerClassificationsQuery: { data: allOwnerClassifications },
      waterSourcesQuery: { data: allWaterSourceTypes },
    },
  } = useWaterRightsContext();

  const { overlayTypes: allOverlays } = useOverlaysContext();

  const { fallbackColor, getColorByIndex, getOverlayColorByIndex } = useColorMappingsBase();

  const beneficialUseColors = useMemo(() => {
    let colorIndex = 0;
    return (
      allBeneficialUses?.map((a) => ({
        key: a.beneficialUseName,
        color: getColorByIndex(colorIndex++),
      })) ?? []
    );
  }, [allBeneficialUses, getColorByIndex]);

  const ownerClassificationColors = useMemo(() => {
    let colorIndex = 0;
    return (
      allOwnerClassifications?.map((a) => ({
        key: a,
        color: getColorByIndex(colorIndex++),
      })) ?? []
    );
  }, [allOwnerClassifications, getColorByIndex]);

  const waterSourceTypeColors = useMemo(() => {
    let colorIndex = 0;
    return (
      allWaterSourceTypes?.map((a) => ({
        key: a,
        color: getColorByIndex(colorIndex++),
      })) ?? []
    );
  }, [allWaterSourceTypes, getColorByIndex]);

  const overlayTypeColors = useMemo(() => {
    let colorIndex = 0;
    return (
      allOverlays?.map((oType) => ({
        key: oType,
        color: getOverlayColorByIndex(colorIndex++),
      })) ?? []
    );
  }, [allOverlays, getOverlayColorByIndex]);

  const getBeneficialUseColor = useCallback(
    (beneficialUseName: string, index: number) => {
      return beneficialUseColors.find((item) => item.key === beneficialUseName)?.color ?? getColorByIndex(index);
    },
    [beneficialUseColors, fallbackColor],
  );

  const getOwnerClassificationColor = useCallback(
    (ownerClassification: string) => {
      return ownerClassificationColors.find((item) => item.key === ownerClassification)?.color ?? fallbackColor;
    },
    [ownerClassificationColors, fallbackColor],
  );

  const getWaterSourceTypeColor = useCallback(
    (waterSourceType: string) => {
      return waterSourceTypeColors.find((item) => item.key === waterSourceType)?.color ?? fallbackColor;
    },
    [waterSourceTypeColors, fallbackColor],
  );

  const getOverlayColor = useCallback(
    (overlayType: string) => {
      return overlayTypeColors.find((item) => item.key === overlayType)?.color ?? fallbackColor;
    },
    [overlayTypeColors, fallbackColor],
  );

  return {
    beneficialUseColors,
    ownerClassificationColors,
    waterSourceTypeColors,
    overlayTypeColors,
    getBeneficialUseColor,
    getOwnerClassificationColor,
    getWaterSourceTypeColor,
    getOverlayColor,
    fallbackColor,
  };
}
