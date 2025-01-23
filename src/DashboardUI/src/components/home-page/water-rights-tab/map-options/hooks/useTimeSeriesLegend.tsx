import React, { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';
import { timeSeriesColor } from '../../../../../config/constants';

export function useTimeSeriesLegend() {
  const { renderedFeatures, setLayerFillColors } = useMapContext();

  const isTimeSeriesVisible = useMemo(() => {
    return renderedFeatures.some(
      (feature) =>
        feature.layer?.id === mapLayerNames.timeSeriesPolygonsLayer ||
        feature.layer?.id === mapLayerNames.timeSeriesPointsLayer,
    );
  }, [renderedFeatures]);

  const legendItems = useMemo(() => {
    if (!isTimeSeriesVisible) return undefined;

    return (
      <MapLegendCircleItem key="timeSeries" color={timeSeriesColor}>
        Time Series Data
      </MapLegendCircleItem>
    );
  }, [isTimeSeriesVisible, timeSeriesColor]);

  useEffect(() => {
    setLayerFillColors({
      layer: mapLayerNames.timeSeriesPolygonsLayer,
      fillColor: timeSeriesColor,
    });
  }, [timeSeriesColor, setLayerFillColors]);

  return { legendItems };
}
