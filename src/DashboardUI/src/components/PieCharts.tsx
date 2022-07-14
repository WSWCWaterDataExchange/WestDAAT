import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Col, Row } from 'react-bootstrap';
import { colorList } from '../config/constants';
import { AnalyticsSummaryInformation } from '../data-contracts/AnalyticsSummaryInformation';
import { useBeneficialUses } from '../hooks/useSystemQuery';

interface PieChartProps {
    dataByBeneficialUse: AnalyticsSummaryInformation[] | undefined;
}

function PieCharts(props: PieChartProps) {
    const { data: allBeneficialUses } = useBeneficialUses();

    let colorIndex = 0;
    let colorMapping: { key: string, color: string }[];
    colorMapping = allBeneficialUses?.map(a => ({ key: a.beneficialUseName, color: colorList[colorIndex++ % colorList.length] })) ?? [];

    let flowSum = 0;
    let volumeSum = 0;
    let pointSum = 0;
    props.dataByBeneficialUse?.forEach(beneficialUse => {
        const currentColor = (colorMapping.find(color => color.key === beneficialUse.primaryUseCategoryName));
        beneficialUse.color = currentColor?.color || colorMapping.find(color => color.key === 'Unspecified')?.color;
        flowSum += beneficialUse.flow || 0;
        volumeSum += beneficialUse.volume || 0;
        pointSum += beneficialUse.points || 0;
    })

    const flowOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Cumulative Flow (CFS) of Rendered Sites'
        },
        subtitle: {
            text: `${flowSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} (CFS)`
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.dataByBeneficialUse?.map(x => ({ name: x.primaryUseCategoryName, y: x.flow, color: x.color }))
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
        subtitle: {
            text: `${pointSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} Sites`
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.dataByBeneficialUse?.map(x => ({ name: x.primaryUseCategoryName, y: x.points, color: x.color }))
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
        subtitle: {
            text: `${volumeSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} (AF)`
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        series: [
            {
                data: props.dataByBeneficialUse?.map(x => ({ name: x.primaryUseCategoryName, y: x.volume, color: x.color }))
            }
        ]
    };

    return <div>
        <div className="my-3 d-flex justify-content-center">
            <a href="https://westernstateswater.org/wade/westdaat-analytics" target="_blank" rel="noopener noreferrer">Learn about WestDAAT analytics</a>
        </div>
        <Row>
            <Col lg="4">
                <HighchartsReact highcharts={Highcharts} options={countOptions} />
            </Col>
            <Col lg="4">
                <HighchartsReact highcharts={Highcharts} options={flowOptions} />
            </Col>
            <Col lg="4">
                <HighchartsReact highcharts={Highcharts} options={volumeOptions} />
            </Col>
        </Row>

    </div>
};

export default PieCharts;