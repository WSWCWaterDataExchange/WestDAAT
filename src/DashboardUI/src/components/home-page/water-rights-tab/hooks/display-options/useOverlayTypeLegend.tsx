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

    // Log only features with oType
    renderedFeatures.forEach((feature) => {
      const raw = feature?.properties?.oType;
      if (raw) {
        console.log("Feature with oType:", {
          properties: feature.properties, // Log all properties
          rawOType: raw, // Log raw oType value
        });

        if (typeof raw === 'string') {
          try {
            const arrayOfTypes = JSON.parse(raw);
            if (Array.isArray(arrayOfTypes)) {
              const sortedTypes = arrayOfTypes
                .filter((type) => typeof type === 'string' && type.trim().length > 0)
                .sort();
              if (sortedTypes.length > 0) {
                types.add(sortedTypes[0]); // Add the first alphabetically
              }
            }
          } catch {
            console.error("Error parsing oType for feature:", raw); // Log errors parsing oType
          }
        }
      }
    });

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
        fillColor.push(['==', ['get', 'oType'], JSON.stringify([key])]); // Match raw stringified JSON
        fillColor.push(color);
      });
      fillColor.push(fallbackColor);
    } else {
      fillColor = fallbackColor;
    }

    console.log("Applying fillColor to overlayTypesPolygonsLayer:", fillColor);

    setLayerFillColors({
      layer: mapLayerNames.overlayTypesPolygonsLayer,
      fillColor,
    });
  }, [colorMappings, fallbackColor, setLayerFillColors]);



  return { legendItems };
}
