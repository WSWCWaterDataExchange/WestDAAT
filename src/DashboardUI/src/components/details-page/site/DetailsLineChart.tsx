import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HC_Data from 'highcharts/modules/export-data';
import AnnotationsModule from 'highcharts/modules/annotations';
import HighchartsReact from 'highcharts-react-official';
import { useSiteDetailsContext } from './Provider';
import { SiteUsagePoint } from '../../../data-contracts/SiteUsagePoint';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  HC_Data(Highcharts);
  AnnotationsModule(Highcharts);

  Highcharts.setOptions({
    lang: {
      thousandsSep: ',',
    },
  });
}

function formatData(siteUsagePoints: SiteUsagePoint[]) {
  const series: unknown[] = [];
  const groups = Object.groupBy(siteUsagePoints, ({ variableUuid }) => variableUuid);
  for (const group in groups) {
    const grouping = groups[group] ?? [];

    const data = grouping.map((point) => [point.timeFrameStartDate.getTime(), point.amount]);
    series.push({
      name: group,
      data,
    });
  }
  return series;
}

function DetailsLineChart() {
  const {
    hostData: {
      siteUsageQuery: { data: siteUsage },
    },
  } = useSiteDetailsContext();
  return (
    <div className="d-flex flex-column align-items-center m-2">
      <h1>Time Series Amount Line Plot</h1>
      {siteUsage?.siteUsagePoints && siteUsage.siteUsagePoints.length > 0 && (
        <div className="w-100">
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemMarginTop: 10,
                itemMarginBottom: 10,
                title: {
                  text: 'WaDE Variable UUID',
                },
              },
              exporting: {
                enabled: false,
              },
              title: {
                text: '',
              },
              series: formatData(siteUsage.siteUsagePoints),
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: `Amount (${siteUsage.amountUnit})`,
                },
              },
              tooltip: {
                xDateFormat: '%m/%d/%Y',
                pointFormat: `Amount: {point.y:.2f} ${siteUsage.amountUnit}`,
                headerFormat: `<span style="font-size: 12px">Date: <b>{point.key}</b></span><br/>`,
              },
            }}
          />
        </div>
      )}

      {siteUsage?.siteUsagePoints.length === 0 && <div className="d-flex justify-content-center">No results found</div>}
    </div>
  );
}

export default DetailsLineChart;
