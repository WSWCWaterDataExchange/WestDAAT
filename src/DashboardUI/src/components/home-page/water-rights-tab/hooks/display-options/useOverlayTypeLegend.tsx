import React, { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { useColorMappings } from '../useColorMappings';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';

export function useOverlayTypeLegend() {
  const { renderedFeatures, setLayerFillColors } = useMapContext();
  const { overlayTypeColors, fallbackColor } = useColorMappings();

  const renderedOverlayTypes = useMemo(() => {
    const types = new Set<string>();
    for (const feature of renderedFeatures) {
      const raw = feature?.properties?.oType;
      if (typeof raw === 'string') {
        try {
          const arrayOfTypes = JSON.parse(raw);
          if (Array.isArray(arrayOfTypes)) {
            arrayOfTypes.forEach((type) => {
              if (typeof type === 'string' && type.trim().length > 0) {
                types.add(type);
              }
            });
          }
        } catch {}
      }
    }
    return Array.from(types);
  }, [renderedFeatures]);

  const colorMappings = useMemo(() => {
    return overlayTypeColors.filter((colorObj) =>
      renderedOverlayTypes.includes(colorObj.key),
    );
  }, [overlayTypeColors, renderedOverlayTypes]);

  const legendItems = useMemo(() => {
    if (colorMappings.length === 0) return undefined;
    return colorMappings.map((colorObj) => (
      <MapLegendCircleItem key={colorObj.key} color={colorObj.color}>
        {colorObj.key}
      </MapLegendCircleItem>
    ));
  }, [colorMappings]);

  useEffect(() => {
    let fillColor: any;
    if (colorMappings.length > 0) {
      fillColor = ['case'];
      colorMappings.forEach(({ key, color }) => {
        fillColor.push(['==', ['get', 'oType'], key]);
        fillColor.push(color);
      });
      fillColor.push(fallbackColor);
    } else {
      fillColor = fallbackColor;
    }
    setLayerFillColors({
      layer: mapLayerNames.overlayTypesPolygonsLayer,
      fillColor,
    });
  }, [colorMappings, fallbackColor, setLayerFillColors]);

  return { legendItems };
}
