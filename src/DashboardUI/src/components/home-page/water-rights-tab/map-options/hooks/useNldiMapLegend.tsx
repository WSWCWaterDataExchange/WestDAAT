import React, { useMemo } from 'react';
import { nldi, timeSeriesColor } from '../../../../../config/constants';
import { useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';
import { DataPoints } from '../../../../../data-contracts/nldi';
import { MapLegendCircleItem, MapLegendItem, MapLegendMarkerItem } from '../../../../map/MapLegendItem';
import { useTimeSeriesContext } from '../../sidebar-filtering/TimeSeriesProvider';

export function useNldiMapLegend() {
  const {
    filters: {
      isNldiFilterActive,
      nldiFilterData: { dataPoints: nldiDataPoints } = {
        dataPoints: DataPoints.None,
      },
    },
  } = useWaterRightsContext();

  const { isTimeSeriesFilterActive } = useTimeSeriesContext();

  const legendItems = useMemo(() => {
    if (!isNldiFilterActive) return undefined;

    return (
      <div className="legend-nldi">
        <MapLegendMarkerItem color={nldi.colors.mapMarker}>Starting Point of Interest</MapLegendMarkerItem>
        <MapLegendItem>
          <span className="legend-flowline">
            <span className="legend-flowline legend-flowline-main" style={{ backgroundColor: nldi.colors.mainstem }} />
          </span>
          Mainstem
        </MapLegendItem>
        <MapLegendItem>
          <span>
            <span
              className="legend-flowline legend-flowline-tributary"
              style={{ backgroundColor: nldi.colors.tributaries }}
            />
          </span>
          Tributaries
        </MapLegendItem>
        {!!((nldiDataPoints ?? DataPoints.None) & DataPoints.Usgs) && (
          <MapLegendCircleItem color={nldi.colors.usgs}>USGS NWIS Sites</MapLegendCircleItem>
        )}
        {!!((nldiDataPoints ?? DataPoints.None) & DataPoints.Epa) && (
          <MapLegendCircleItem color={nldi.colors.epa}>
            EPA Water Quality Portal
            <br /> Sites OSM Standard
          </MapLegendCircleItem>
        )}

        {isTimeSeriesFilterActive && !!((nldiDataPoints ?? DataPoints.None) & DataPoints.WadeTimeseries) && (
          <MapLegendCircleItem color={timeSeriesColor}>NLDI Time Series Sites</MapLegendCircleItem>
        )}
      </div>
    );
  }, [isNldiFilterActive, nldiDataPoints, isTimeSeriesFilterActive]);

  return { legendItems };
}
