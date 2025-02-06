import React from 'react';
import { TimeSeriesSiteTypeSelect } from './SiteTypeSelectTimeseries';

export function TimeSeriesFilter() {
  return (
    <div className="position-relative flex-grow-1">
      <TimeSeriesSiteTypeSelect />
    </div>
  );
}

export default TimeSeriesFilter;
