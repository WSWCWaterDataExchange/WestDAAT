import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HC_Data from 'highcharts/modules/export-data';
import AnnotationsModule from 'highcharts/modules/annotations';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
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
  chart: {
    type: 'pie',
  },
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

interface PieChartsProps {
  selectedDropdownOption: DropdownOption | null;
  setSelectedDropdownOption: (option: DropdownOption) => void;
}

function PieCharts(props: PieChartsProps) {
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const request: WaterRightsSearchCriteriaWithGrouping = {
    ...searchCriteria,
    groupValue: Number(props.selectedDropdownOption?.value),
  };
  const { data: pieChartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(request);

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
    if (!pieChartSearchResults || !pieChartSearchResults.analyticsSummaryInformation) return initData;

    return pieChartSearchResults.analyticsSummaryInformation.reduce((prev, curr) => {
      const [flow, vol, point] = prev;
      const name = curr.primaryUseCategoryName ?? 'Unspecified';
      const color = getBeneficialUseColor(name);
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
  }, [pieChartSearchResults, getBeneficialUseColor]);

  return (
    <div>
      <div className="my-3 d-flex justify-content-center">
        <a href="https://westernstateswater.org/wade/westdaat-analytics" target="_blank" rel="noopener noreferrer">
          Learn about WestDAAT analytics
        </a>
      </div>

      <AnalyticsInfoGroupingDropdown
        isFetching={isFetching}
        analyticsSummaryInformationResponse={pieChartSearchResults}
        selectedDropdownOption={props.selectedDropdownOption}
        setSelectedDropdownOption={props.setSelectedDropdownOption}
      />

      {pieChartSearchResults?.analyticsSummaryInformation &&
        pieChartSearchResults?.analyticsSummaryInformation?.length > 0 && (
          <Container fluid={true}>
            <Row>
              <Col lg="4">
                <ChartData name="count" data={pointData} />
              </Col>
              <Col lg="4">
                <ChartData name="flow" data={flowData} />
              </Col>
              <Col lg="4">
                <ChartData name="volume" data={volumeData} />
              </Col>
            </Row>
          </Container>
        )}
      {pieChartSearchResults?.analyticsSummaryInformation?.length === 0 && !isFetching && (
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

export default PieCharts;

function ChartData(props: { name: 'volume' | 'flow' | 'count'; data: ChartDataType }) {
  const { name, data } = props;

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

  const chartOptions = useMemo(() => {
    return {
      ...chartOptionsBase,
      subtitle: {
        ...chartOptionsBase.subtitle,
        text: subTitle,
      },
      series: [
        {
          data: data.data.sort((a, b) => b.y - a.y),
        },
      ],
    };
  }, [chartOptionsBase, subTitle, data.data]);

  return data.data.length > 0 ? (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  ) : (
    <div className="d-flex justify-content-center align-items-center h-100">No {props.name} data found</div>
  );
}
