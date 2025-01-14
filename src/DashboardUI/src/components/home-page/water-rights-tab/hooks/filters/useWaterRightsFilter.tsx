import { useCallback, useState, useEffect } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';

export function useWaterRightsFilters() {
  const { setLayerFilters, setVisibleLayers, visibleLayers } = useMapContext();
  const [isWaterRightsFilterActive, setIsWaterRightsFilterActive] = useState(true);

  useEffect(() => {
    if (isWaterRightsFilterActive) {
      const newLayers = [
        ...new Set([...visibleLayers, mapLayerNames.waterRightsPointsLayer, mapLayerNames.waterRightsPolygonsLayer]),
      ];
      setVisibleLayers(newLayers);

      setLayerFilters([
        {
          layer: mapLayerNames.waterRightsPointsLayer,
          filter: ['all'], // Add appropriate filter logic
        },
        {
          layer: mapLayerNames.waterRightsPolygonsLayer,
          filter: ['all'], // Add appropriate filter logic
        },
      ]);
    }
  }, [isWaterRightsFilterActive, setLayerFilters, setVisibleLayers, visibleLayers]);

  const toggleWaterRightsFilters = useCallback(() => {
    setIsWaterRightsFilterActive((prev) => {
      const active = !prev;

      if (active) {
        const newLayers = [
          ...new Set([...visibleLayers, mapLayerNames.waterRightsPointsLayer, mapLayerNames.waterRightsPolygonsLayer]),
        ];
        setVisibleLayers(newLayers);

        setLayerFilters([
          {
            layer: mapLayerNames.waterRightsPointsLayer,
            filter: ['all'],
          },
          {
            layer: mapLayerNames.waterRightsPolygonsLayer,
            filter: ['all'],
          },
        ]);
      } else {
        const newLayers = visibleLayers.filter(
          (layer) =>
            ![mapLayerNames.waterRightsPointsLayer, mapLayerNames.waterRightsPolygonsLayer].includes(layer)
        );
        setVisibleLayers(newLayers);

        setLayerFilters([
          {
            layer: mapLayerNames.waterRightsPointsLayer,
            filter: null,
          },
          {
            layer: mapLayerNames.waterRightsPolygonsLayer,
            filter: null,
          },
        ]);
      }

      return active;
    });
  }, [setLayerFilters, setVisibleLayers, visibleLayers]);

  return {
    isWaterRightsFilterActive,
    toggleWaterRightsFilters,
  };
}
