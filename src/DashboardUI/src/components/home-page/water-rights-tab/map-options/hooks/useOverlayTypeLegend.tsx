import React, { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { useColorMappings } from './useColorMappings';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';
import { useOverlaysContext } from '../../sidebar-filtering/OverlaysProvider';

export function useOverlayTypeLegend() {
  const { renderedFeatures, setLayerFillColors } = useMapContext();
  const { overlayTypeColors, fallbackColor } = useColorMappings();
  const { visibleOverlayTypes } = useOverlaysContext();

  const renderedOverlayTypes = useMemo(() => {
    const tryParseJsonArray = (value: any) => {
      try {
        return JSON.parse(value ?? '[]');
      } catch {
        return [];
      }
    };
    return overlayTypeColors.filter(
      (colorItem) =>
        visibleOverlayTypes.includes(colorItem.key) &&
        renderedFeatures.some((feature) => tryParseJsonArray(feature.properties?.['oType']).includes(colorItem.key)),
    );
  }, [renderedFeatures, overlayTypeColors, visibleOverlayTypes]);

  const legendItems = useMemo(() => {
    if (renderedOverlayTypes.length === 0) {
      return undefined;
    }

    return renderedOverlayTypes.map((colorObj) => (
      <MapLegendCircleItem key={colorObj.key} color={colorObj.color}>
        {colorObj.key}
      </MapLegendCircleItem>
    ));
  }, [renderedOverlayTypes]);

  useEffect(() => {
    const colorArray: any = ['case'];

    visibleOverlayTypes.forEach((overlayKey) => {
      const overlayColor = overlayTypeColors.find((item) => item.key === overlayKey)?.color;
      if (overlayColor) {
        colorArray.push(['in', overlayKey, ['get', 'oType']]);
        colorArray.push(overlayColor);
      }
    });

    colorArray.push(fallbackColor);

    setLayerFillColors({
      layer: mapLayerNames.overlayTypesPolygonsLayer,
      fillColor: colorArray,
    });
  }, [visibleOverlayTypes, overlayTypeColors, fallbackColor, setLayerFillColors]);

  return { legendItems };
}
