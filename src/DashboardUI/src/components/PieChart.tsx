import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Col, Row } from 'react-bootstrap';
import { AnalyticsSummaryInformation } from '../data-contracts/AnalyticsSummaryInformation';

interface PieChartProps {
    data: AnalyticsSummaryInformation[] | undefined;
}

function PieChart(props: PieChartProps) {

    const flowOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Cumulative Flow (CFS) of Rendered Sites'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.data?.map(x => [x.primaryUseCategoryName, x.flow])
            }
        ]
    };

    const countOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Count of Rendered Points'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.data?.map(x => [x.primaryUseCategoryName, x.points])
            }
        ]
    };
    const volumeOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Cumulative Volume (AF) of Rendered Sites'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.data?.map(x => [x.primaryUseCategoryName, x.points])
            }
        ]
    };

    return <div>
        <Row>
            <Col lg="4"><HighchartsReact highcharts={Highcharts} options={countOptions} />
            </Col>
            <Col lg="4">
                <HighchartsReact highcharts={Highcharts} options={flowOptions} />
            </Col>
            <Col lg="4"><HighchartsReact highcharts={Highcharts} options={volumeOptions} />
            </Col>
        </Row>

    </div>
};

export default PieChart;