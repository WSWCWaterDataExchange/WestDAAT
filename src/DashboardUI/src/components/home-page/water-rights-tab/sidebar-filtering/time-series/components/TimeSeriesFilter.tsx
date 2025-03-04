import React from 'react';
import { TimeSeriesSiteTypeSelect } from './SiteTypeSelectTimeseries';
import TimeSeriesDateRange from './TimeSeriesDateRange';
import TimeSeriesPrimaryUseCategorySelect from './TimeSeriesPrimaryUseCategorySelect';
import TimeSeriesVariableTypeSelect from './TimeSeriesVariableTypeSelect';
import TimeSeriesWaterSourceTypeSelect from './TimeSeriesWaterSourceTypeSelect';

export function TimeSeriesFilter() {
  return (
    <div className="position-relative flex-grow-1">
      <TimeSeriesVariableTypeSelect />
      <TimeSeriesSiteTypeSelect />
      <TimeSeriesPrimaryUseCategorySelect />
      <TimeSeriesWaterSourceTypeSelect />
      <TimeSeriesDateRange />
    </div>
  );
}

export default TimeSeriesFilter;
