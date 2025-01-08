import React, { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { useColorMappings } from '../useColorMappings';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';

export function useOverlayTypeLegend() {
  const { renderedFeatures, setLayerFillColors } = useMapContext();
  const { overlayTypeColors, fallbackColor } = useColorMappings();

  const renderedOverlayTypes = useMemo(() => {
    const tryParseJsonArray = (value: any) => {
      try {
        return JSON.parse(value ?? '[]');
      } catch {
        return [];
      }
    };
    let colorMappings = [...overlayTypeColors]

    colorMappings = colorMappings.filter((a) =>
      renderedFeatures.some(
        (b) => b.properties && tryParseJsonArray(b.properties['oType']).some((c: string) => c === a.key),
      ),
    );
    return colorMappings;
  }, [renderedFeatures]);



  const legendItems = useMemo(() => {
    if (renderedOverlayTypes.length === 0) return undefined;
    return renderedOverlayTypes.map((colorObj) => (
      <MapLegendCircleItem key={colorObj.key} color={colorObj.color}>
        {colorObj.key}
      </MapLegendCircleItem>
    ));
  }, [renderedOverlayTypes]);

  useEffect(() => {
    if (!renderedFeatures || renderedFeatures.length === 0) {
      return;
    }
    let colorArray: any;
    if (overlayTypeColors.length > 0) {
      colorArray = ['case'];
      renderedOverlayTypes.forEach((a) => {
        colorArray.push(['in', a.key, ['get', 'oType']]);
        colorArray.push(a.color);
      });
      colorArray.push(fallbackColor);
    } else {
      colorArray = fallbackColor;
    }
    console.log("Applying fillColor to overlayTypesPolygonsLayer:", colorArray);

    setLayerFillColors({
      layer: mapLayerNames.overlayTypesPolygonsLayer,
      fillColor: colorArray,
    });
  }, [overlayTypeColors, fallbackColor, setLayerFillColors, renderedOverlayTypes]);

  return { legendItems };
}
