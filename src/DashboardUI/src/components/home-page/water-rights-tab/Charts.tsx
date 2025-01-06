import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HC_Data from 'highcharts/modules/export-data';
import AnnotationsModule from 'highcharts/modules/annotations';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { Col, Container, Nav, ProgressBar, Row, Tab } from 'react-bootstrap';
import { useGetAnalyticsSummaryInfo } from '../../../hooks/queries';
import { useColorMappings } from './hooks/useColorMappings';
import { useWaterRightsSearchCriteria } from './hooks/useWaterRightsSearchCriteria';
import AnalyticsInfoGroupingDropdown from './AnalyticsInfoGroupingDropdown';
import { DropdownOption } from '../../../data-contracts/DropdownOption';
import { WaterRightsSearchCriteriaWithGrouping } from '../../../data-contracts/WaterRightsSearchCriteria';

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

const chartExporting = {
  chartOptions: {
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>:<br>{point.y:,.0f} ({point.percentage:.1f}%)',
        },
      },
    },
  },
};

const chartCommonOptions = {
  subtitle: {},
  series: [],
  exporting: chartExporting,
};

const flowOptionsBase = {
  ...chartCommonOptions,
  title: {
    text: 'Cumulative Flow (CSF) of Water Rights',
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.1f}</b>',
  },
};

const countOptionsBase = {
  ...chartCommonOptions,
  title: {
    text: 'Count of Water Rights',
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.0f}</b>',
  },
};

const volumeOptionsBase = {
  ...chartCommonOptions,
  title: {
    text: 'Cumulative Volume (AF) of Water Rights',
  },
  tooltip: {
    pointFormat: `<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.2f}</b>`,
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

interface ChartsProps {
  selectedDropdownOption: DropdownOption | null;
  setSelectedDropdownOption: (option: DropdownOption) => void;
}

function Charts(props: ChartsProps) {
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const request: WaterRightsSearchCriteriaWithGrouping = {
    ...searchCriteria,
    groupValue: Number(props.selectedDropdownOption?.value),
  };
  const { data: chartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(request);
  const [chartType, setChartType] = useState<SupportedSeriesChartTypes>('pieChart');

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
      <div className="my-3 d-flex justify-content-center">
        <a href="https://westernstateswater.org/wade/westdaat-analytics" target="_blank" rel="noopener noreferrer">
          Learn about WestDAAT analytics
        </a>
      </div>

      <Container fluid={true}>
        <Row>
          <Col lg="3">
            <Tab.Container activeKey={chartType} onSelect={(tab) => setChartType(tab as SupportedSeriesChartTypes)}>
              <Nav variant="pills" defaultActiveKey="pieChart" className="input-group">
                <Nav.Item>
                  <Nav.Link eventKey="pieChart">Pie Chart</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="barChart">Bar Graph</Nav.Link>
                </Nav.Item>
              </Nav>
            </Tab.Container>
          </Col>
          <Col lg="9">
            <AnalyticsInfoGroupingDropdown
              isFetching={isFetching}
              analyticsSummaryInformationResponse={chartSearchResults}
              selectedDropdownOption={props.selectedDropdownOption}
              setSelectedDropdownOption={props.setSelectedDropdownOption}
            />
          </Col>
        </Row>
      </Container>

      {chartSearchResults?.analyticsSummaryInformation &&
        chartSearchResults?.analyticsSummaryInformation?.length > 0 && (
          <Container fluid={true}>
            <Row>
              <Col lg="4">
                <SeriesChart name="count" data={pointData} chartType={chartType} />
              </Col>
              <Col lg="4">
                <SeriesChart name="flow" data={flowData} chartType={chartType} />
              </Col>
              <Col lg="4">
                <SeriesChart name="volume" data={volumeData} chartType={chartType} />
              </Col>
            </Row>
          </Container>
        )}
      {chartSearchResults?.analyticsSummaryInformation?.length === 0 && !isFetching && (
        <div className="d-flex justify-content-center">No results found</div>
      )}
      {isFetching && (
        <div>
          <div className="d-flex justify-content-center">Loading... </div>
          <ProgressBar animated now={100} />
        </div>
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
      series: [
        {
          data: data.data.sort((a, b) => b.y - a.y),
          type: highchartsChartType,
        },
      ],
    };
  }, [chartOptionsBase, subTitle, highchartsChartType, data.data]);

  return data.data.length > 0 ? (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  ) : (
    <div className="d-flex justify-content-center align-items-center h-100">No {props.name} data found</div>
  );
}
