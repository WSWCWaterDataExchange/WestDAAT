import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { useContext, useCallback, useState, useEffect } from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { colorList } from '../config/constants';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import { FilterContext } from '../FilterProvider';
import { useGetAnalyticsSummaryInfo } from '../hooks';
import { useBeneficialUses } from '../hooks/useSystemQuery';

function PieCharts() {
    const { filters } = useContext(FilterContext);
    const [searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);

    const handleFiltersChange = useCallback(() => {
        setSearchCriteria({
            beneficialUses: filters.beneficialUses?.map(b => b.beneficialUseName),
            filterGeometry: filters.polyline.map(p => JSON.stringify(p.data.geometry)),
            expemptofVolumeFlowPriority: filters.includeExempt,
            minimumFlow: filters.minFlow,
            maximumFlow: filters.maxFlow,
            minimumVolume: filters.minVolume,
            maximumVolume: filters.maxVolume,
            podOrPou: filters.podPou,
            minimumPriorityDate: filters.minPriorityDate ? moment.unix(filters.minPriorityDate).toDate() : undefined,
            maximumPriorityDate: filters.maxPriorityDate ? moment.unix(filters.maxPriorityDate).toDate() : undefined,
            ownerClassifications: filters.ownerClassifications,
            waterSourceTypes: filters.waterSourceTypes,
            riverBasinNames: filters.riverBasinNames,
            allocationOwner: filters.allocationOwner,
            states: filters.states,
            wadeSitesUuids: filters.nldiIds
        });
    }, [filters, setSearchCriteria]);

    const { data: pieChartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(searchCriteria)
    useEffect(() => {
        handleFiltersChange();
    }, [filters, handleFiltersChange]);

    const { data: allBeneficialUses } = useBeneficialUses();

    let colorIndex = 0;
    let colorMapping: { key: string, color: string }[];
    colorMapping = allBeneficialUses?.map(a => ({ key: a.beneficialUseName, color: colorList[colorIndex++ % colorList.length] })) ?? [];

    let flowSum = 0;
    let volumeSum = 0;
    let pointSum = 0;
    pieChartSearchResults?.forEach(beneficialUse => {
        const currentColor = (colorMapping.find(color => color.key === beneficialUse.primaryUseCategoryName));
        beneficialUse.color = currentColor?.color || colorMapping.find(color => color.key === 'Unspecified')?.color;
        flowSum += beneficialUse.flow || 0;
        volumeSum += beneficialUse.volume || 0;
        pointSum += beneficialUse.points || 0;
    })

    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

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
            pointFormat: '<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.0f}</b>'
        },
        series: [
            {
                data: pieChartSearchResults?.map(x => ({ name: x.primaryUseCategoryName, y: x.flow, color: x.color }))
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
            pointFormat: '<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.0f}</b>'
        },
        series: [
            {
                data: pieChartSearchResults?.map(x => ({ name: x.primaryUseCategoryName, y: x.points, color: x.color }))
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
            pointFormat: `<b>{point.percentage:.1f}% &nbsp;&nbsp; {point.y:,.0f}</b>`
        },
        series: [
            {
                data: pieChartSearchResults?.map(x => ({ name: x.primaryUseCategoryName, y: x.volume, color: x.color }))
            }
        ]
    };

    return <div className="scrollable-content ">
        <div className="my-3 d-flex justify-content-center">
            <a href="https://westernstateswater.org/wade/westdaat-analytics" target="_blank" rel="noopener noreferrer">Learn about WestDAAT analytics</a>
        </div>


        {pieChartSearchResults && pieChartSearchResults?.length > 0 &&
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
            </Row>}
        {pieChartSearchResults?.length === 0 && !isFetching &&
            <div className="d-flex justify-content-center">No results found</div>
        }
        {isFetching &&
            <div>
                <div className="d-flex justify-content-center">Loading... </div><ProgressBar animated now={100} />
            </div>
        }

    </div>
};

export default PieCharts;