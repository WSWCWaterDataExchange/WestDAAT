import React from 'react';
import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useWaterRightsContext } from '../../Provider';
import { mapLayerNames } from '../../../../../config/maps';
import { MapGrouping } from '../../MapGrouping';
import { useColorMappings } from '../useColorMappings';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';

export function useWadeLegend() {
  const { renderedFeatures, setLayerCircleColors, setLayerFillColors } =
    useMapContext();

  const {
    filters: {
      beneficialUseNames: beneficialUseFilters,
      waterSourceTypes: waterSourceTypeFilters,
      ownerClassifications: ownerClassificationsFilters,
    },
    displayOptions: { mapGrouping: mapGroupingOption },
  } = useWaterRightsContext();

  const {
    beneficialUseColors,
    ownerClassificationColors,
    waterSourceTypeColors,
    fallbackColor,
  } = useColorMappings();

  const mapGroupingColors = useMemo(() => {
    switch (mapGroupingOption) {
      case MapGrouping.BeneficialUse:
        return beneficialUseColors;
      case MapGrouping.OwnerClassification:
        return ownerClassificationColors;
      case MapGrouping.WaterSourceType:
        return waterSourceTypeColors;
    }
  }, [
    mapGroupingOption,
    beneficialUseColors,
    ownerClassificationColors,
    waterSourceTypeColors,
  ]);

  const renderedMapGroupingsColors = useMemo(() => {
    const tryParseJsonArray = (value: any) => {
      try {
        return JSON.parse(value ?? '[]');
      } catch (e) {
        return [];
      }
    };
    let colorMappings = [...mapGroupingColors];
    //we first filter our colors by the filters because some points may meet multiple criteria and we don't want a filtered out color to show in the legend.
    if (
      mapGroupingOption === (MapGrouping.BeneficialUse as string) &&
      beneficialUseFilters &&
      beneficialUseFilters?.length > 0
    ) {
      colorMappings = colorMappings.filter((a) =>
        beneficialUseFilters?.some((b) => b === a.key),
      );
    }
    if (
      mapGroupingOption === (MapGrouping.WaterSourceType as string) &&
      waterSourceTypeFilters &&
      waterSourceTypeFilters.length > 0
    ) {
      colorMappings = colorMappings.filter((a) =>
        waterSourceTypeFilters?.some((b) => b === a.key),
      );
    }
    if (
      mapGroupingOption === (MapGrouping.OwnerClassification as string) &&
      ownerClassificationsFilters &&
      ownerClassificationsFilters.length > 0
    ) {
      colorMappings = colorMappings.filter((a) =>
        ownerClassificationsFilters?.some((b) => b === a.key),
      );
    }
    colorMappings = colorMappings.filter((a) =>
      renderedFeatures.some(
        (b) =>
          b.properties &&
          tryParseJsonArray(b.properties[mapGroupingOption]).some(
            (c: string) => c === a.key,
          ),
      ),
    );

    return colorMappings;
  }, [
    mapGroupingOption,
    mapGroupingColors,
    renderedFeatures,
    beneficialUseFilters,
    waterSourceTypeFilters,
    ownerClassificationsFilters,
  ]);

  const legendItems = useMemo(() => {
    if (renderedMapGroupingsColors.length === 0) {
      return undefined;
    }
    return renderedMapGroupingsColors.map((layer) => {
      return (
        <MapLegendCircleItem key={layer.key} color={layer.color}>
          {layer.key}
        </MapLegendCircleItem>
      );
    });
  }, [renderedMapGroupingsColors]);

  useEffect(() => {
    let colorArray: any;
    if (mapGroupingColors.length > 0) {
      colorArray = ['case'];
      renderedMapGroupingsColors.forEach((a) => {
        colorArray.push(['in', a.key, ['get', mapGroupingOption]]);
        colorArray.push(a.color);
      });
      mapGroupingColors.forEach((a) => {
        colorArray.push(['in', a.key, ['get', mapGroupingOption]]);
        colorArray.push(a.color);
      });
      colorArray.push(fallbackColor);
    } else {
      colorArray = fallbackColor;
    }

    setLayerCircleColors({
      layer: mapLayerNames.waterRightsPointsLayer,
      circleColor: colorArray,
    });
    setLayerFillColors({
      layer: mapLayerNames.waterRightsPolygonsLayer,
      fillColor: colorArray,
    });
  }, [
    mapGroupingOption,
    fallbackColor,
    setLayerCircleColors,
    setLayerFillColors,
    mapGroupingColors,
    renderedMapGroupingsColors,
  ]);
  return { legendItems };
}
