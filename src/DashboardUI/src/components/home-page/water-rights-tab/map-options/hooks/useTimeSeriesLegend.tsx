import React, { useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { MapLegendCircleItem } from '../../../../map/MapLegendItem';
import { timeSeriesColor } from '../../../../../config/constants';

export function useTimeSeriesLegend() {
  const { renderedFeatures } = useMapContext();

  const isTimeSeriesVisible = useMemo(() => {
    return renderedFeatures.some((feature) =>
      feature.layer?.id === mapLayerNames.timeSeriesPointsLayer ||
      feature.layer?.id === mapLayerNames.timeSeriesPolygonsLayer
    );
  }, [renderedFeatures]);

  const legendItems = useMemo(() => {
    if (!isTimeSeriesVisible) return undefined;

    return [
      <MapLegendCircleItem key="timeSeriesSites" color={timeSeriesColor}>
        Time Series Sites
      </MapLegendCircleItem>,
    ];
  }, [isTimeSeriesVisible]);

  return { legendItems };
}
