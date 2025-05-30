import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HC_Data from 'highcharts/modules/export-data';
import AnnotationsModule from 'highcharts/modules/annotations';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { ButtonGroup, Col, Container, Nav, ProgressBar, Row, Tab, ToggleButton } from 'react-bootstrap';
import { useGetAnalyticsSummaryInfo } from '../../../../../hooks/queries';
import { useColorMappings } from '../hooks/useColorMappings';
import { useWaterRightsSearchCriteria } from '../hooks/useWaterRightsSearchCriteria';
import AnalyticsInfoGroupingDropdown from './AnalyticsInfoGroupingDropdown';
import { useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';

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

type SupportedSeriesChartTypes = 'pieChart' | 'barChart';

const chartExporting: Highcharts.ExportingOptions = {
  chartOptions: {
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            let result = '<b>';
            if (this.point.name) {
              result += `${this.point.name}</b>:<br>`;
            }
            if (this.point.y) {
              result += `${this.point.y.toFixed(0)} `;
            }
            if (this.point.percentage) {
              result += `(${this.point.percentage.toFixed(1)}%)`;
            }
            return result;
          },
        },
      },
    },
  },
};

const chartCommonOptions: Highcharts.Options = {
  subtitle: {},
  series: [],
  exporting: chartExporting,
};

const flowOptionsBase: Highcharts.Options = {
  ...chartCommonOptions,
  title: {
    text: 'Cumulative Flow (CSF) of Water Rights',
  },
  tooltip: {
    pointFormatter: function () {
      let result = '<b>';
      if (this.percentage) {
        result += `${this.percentage.toFixed(1)}% &nbsp;&nbsp; `;
      }
      if (this.y) {
        result += `${this.y?.toFixed(1)}`;
      }

      result += '</b>';
      return result;
    },
  },
};

const countOptionsBase: Highcharts.Options = {
  ...chartCommonOptions,
  title: {
    text: 'Count of Water Rights',
  },
  tooltip: {
    pointFormatter: function () {
      let result = '<b>';
      if (this.percentage) {
        result += `${this.percentage.toFixed(1)}% &nbsp;&nbsp; `;
      }
      if (this.y) {
        result += `${this.y?.toFixed(0)}`;
      }

      result += '</b>';
      return result;
    },
  },
};

const volumeOptionsBase: Highcharts.Options = {
  ...chartCommonOptions,
  title: {
    text: 'Cumulative Volume (AF) of Water Rights',
  },
  tooltip: {
    pointFormatter: function () {
      let result = '<b>';
      if (this.percentage) {
        result += `${this.percentage.toFixed(1)}% &nbsp;&nbsp; `;
      }
      if (this.y) {
        result += `${this.y?.toFixed(2)}`;
      }

      result += '</b>';
      return result;
    },
  },
};

type ChartSeriesDataType = {
  name: string;
  y: number;
  color: string;
};
type ChartDataType = {
  sum: number;
  data: ChartSeriesDataType[];
};

function Charts() {
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const { analyticsGroupingOption, setAnalyticsGroupingOption } = useWaterRightsContext();
  const [chartType, setChartType] = useState<SupportedSeriesChartTypes>('pieChart');

  const { data: chartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(searchCriteria);
  const { getBeneficialUseColor } = useColorMappings();

  const [flowData, volumeData, pointData] = useMemo(() => {
    const initData: ChartDataType[] = [
      {
        sum: 0,
        data: [],
      },
      {
        sum: 0,
        data: [],
      },
      {
        sum: 0,
        data: [],
      },
    ];
    if (!chartSearchResults || !chartSearchResults.analyticsSummaryInformation) return initData;

    return chartSearchResults.analyticsSummaryInformation.reduce((prev, curr, index) => {
      const [flow, vol, point] = prev;
      const name = curr.primaryUseCategoryName ?? 'Unspecified';
      const color = getBeneficialUseColor(name, index);
      if (curr.flow && curr.flow > 0) {
        flow.sum += curr.flow;
        flow.data.push({ name, y: curr.flow, color });
      }
      if (curr.volume && curr.volume > 0) {
        vol.sum += curr.volume;
        vol.data.push({ name, y: curr.volume, color });
      }
      if (curr.points && curr.points > 0) {
        point.sum += curr.points;
        point.data.push({ name, y: curr.points, color });
      }
      return [flow, vol, point];
    }, initData);
  }, [chartSearchResults, getBeneficialUseColor]);

  return (
    <div>
      <Container fluid={true}>
        <Row>
          <Col>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <span>Bar Selection</span>
                <ButtonGroup>
                  <ToggleButton
                    className="zindexzero"
                    key="pieChart"
                    id={`barSelection-pieChart`}
                    type="radio"
                    variant="outline-primary"
                    name="barSelectionType"
                    value={"pieChart"}
                    checked={chartType === "pieChart"}
                    onChange={() => setChartType("pieChart")}
                  >
                    Pie Chart
                  </ToggleButton>
                  <ToggleButton
                    className="zindexzero"
                    key="barChart"
                    id={`barSelection-barChart`}
                    type="radio"
                    variant="outline-primary"
                    name="barSelectionType"
                    value={"barChart"}
                    checked={chartType === "barChart"}
                    onChange={() => setChartType("barChart")}
                  >
                    Bar Graph
                  </ToggleButton>
                </ButtonGroup>
              </div>

              <div className="ms-3" style={{ minWidth: '350px' }}>
                <AnalyticsInfoGroupingDropdown
                  isFetching={isFetching}
                  analyticsSummaryInformationResponse={chartSearchResults}
                  selectedDropdownOption={analyticsGroupingOption}
                  setSelectedDropdownOption={setAnalyticsGroupingOption}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="my-3 d-flex">
              <a href="https://westernstateswater.org/wade/westdaat-analytics" target="_blank"
                 rel="noopener noreferrer">
                Learn about WestDAAT analytics
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {searchCriteria.isWaterRightsFilterActive ? (
        <>
          {chartSearchResults?.analyticsSummaryInformation &&
            chartSearchResults?.analyticsSummaryInformation?.length > 0 &&
            searchCriteria.isWaterRightsFilterActive && (
              <Container fluid={true}>
                <Row>
                  <Col lg="4">
                    <SeriesChart name="count" data={pointData} chartType={chartType}/>
                  </Col>
                  <Col lg="4">
                    <SeriesChart name="flow" data={flowData} chartType={chartType}/>
                  </Col>
                  <Col lg="4">
                    <SeriesChart name="volume" data={volumeData} chartType={chartType}/>
                  </Col>
                </Row>
              </Container>
            )}
          {chartSearchResults?.analyticsSummaryInformation?.length === 0 && !isFetching && (
            <div className="d-flex justify-content-center">No results found</div>
          )}
          {isFetching && (
            <div>
              <div className="d-flex justify-content-center">Loading...</div>
              <ProgressBar animated now={100}/>
            </div>
          )}
        </>
      ) : (
        <div className="d-flex justify-content-center">No results found. Water rights must be enabled.</div>
      )}
    </div>
  );
}

export default Charts;

function SeriesChart(props: {
  name: 'volume' | 'flow' | 'count';
  data: ChartDataType;
  chartType: SupportedSeriesChartTypes;
}) {
  const { name, data, chartType } = props;

  const [chartOptionsBase, subTitle] = useMemo(() => {
    switch (name) {
      case 'count':
        return [countOptionsBase, `${data.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} Rights`];
      case 'flow':
        return [flowOptionsBase, `${data.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} (CFS)`];
      case 'volume':
        return [volumeOptionsBase, `${data.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} (AF)`];
    }
  }, [name, data.sum]);

  const highchartsChartType: Highcharts.SeriesOptionsType['type'] = useMemo(() => {
    switch (chartType) {
      case 'pieChart':
        return 'pie';
      case 'barChart':
        return 'column';
    }
  }, [chartType]);

  const sortedData = useMemo(() => {
    return data.data.sort((a, b) => b.y - a.y);
  }, [data.data]);

  const xAxisCategories = useMemo(() => {
    return data.data.map((d) => d.name);
  }, [data.data]);

  const chartOptions: Highcharts.Options = useMemo(() => {
    return {
      ...chartOptionsBase,
      chart: {
        type: highchartsChartType,
      },
      subtitle: {
        ...chartOptionsBase.subtitle,
        text: subTitle,
      },
      xAxis: {
        categories: xAxisCategories,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: sortedData,
          type: highchartsChartType,
        },
      ],
    };
  }, [chartOptionsBase, subTitle, highchartsChartType, sortedData]);

  return data.data.length > 0 ? (
      <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
    )
    :
    (
      <div className="d-flex justify-content-center align-items-center h-100">No {props.name} data found</div>
    );
}

