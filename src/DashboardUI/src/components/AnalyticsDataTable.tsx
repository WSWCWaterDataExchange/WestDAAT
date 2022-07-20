import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, ProgressBar, Table } from "react-bootstrap";
import "../styles/tableView.scss";
import { useFindWaterRights } from "../hooks/useWaterRightQuery";
import { WaterRightsSearchCriteria } from "../data-contracts/WaterRightsSearchCriteria";
import { WaterRightsSearchResults } from "../data-contracts/WaterRightsSearchResults";
import { FormattedDate } from "./FormattedDate";
import { FilterContext } from "../FilterProvider";
import moment from "moment";

function AnalyticsDataTable() {
    const _defaultResults = useMemo(() => ({ currentPageNumber: 0, hasMoreResults: false, waterRightsDetails: [] }), []);

    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);
    const [waterRightsSearchResults, setWaterRightsSearchResults] = useState<WaterRightsSearchResults>(_defaultResults);

    const { filters } = useContext(FilterContext);

    const handleFiltersChange = useCallback(() => {
        setWaterRightsSearchResults(_defaultResults);
        setSearchCriteria({
            pageNumber: 0,
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
            states: filters.states
        });
    }, [_defaultResults, filters, setSearchCriteria, setWaterRightsSearchResults]);

    const handleLoadMoreResults = () => {
        if (waterRightsSearchResults.waterRightsDetails.length === 0) return;
        setSearchCriteria({ ...searchCriteria, pageNumber: waterRightsSearchResults.currentPageNumber + 1 })
    }

    const { data: latestSearchResults, isFetching: isFetchingTableData } = useFindWaterRights(searchCriteria)
    useEffect(() => {
        handleFiltersChange();
    }, [filters, handleFiltersChange]);

    useEffect(() => {
        if (!latestSearchResults) return;

        setHasMoreResults(latestSearchResults.waterRightsDetails.length > 0 && latestSearchResults.hasMoreResults);

        setWaterRightsSearchResults(previousState => ({
            currentPageNumber: latestSearchResults.currentPageNumber,
            hasMoreResults: latestSearchResults.hasMoreResults,
            waterRightsDetails: [...previousState.waterRightsDetails, ...latestSearchResults.waterRightsDetails]
        }));
    }, [latestSearchResults]);

    return <>
        <Table>
            <thead>
                <tr>
                    <th>Allocation UUID</th>
                    <th>Priority Date</th>
                    <th>WaDE Owner Classification</th>
                    <th>WaDE Legal Status</th>
                    <th>Allocation Flow (CFS)</th>
                    <th>Allocation Volume (AF)</th>
                    <th>WaDE Beneficial Use</th>
                </tr>
            </thead>
            <tbody>
                {waterRightsSearchResults.waterRightsDetails?.length > 0 &&
                    waterRightsSearchResults?.waterRightsDetails.map((waterRightDetail) => {
                        return <tr key={waterRightDetail.allocationUuid}>
                            <td><a href={`/details/right/${waterRightDetail.allocationUuid}`} target="_blank" rel="noopener noreferrer">{waterRightDetail.allocationUuid}</a></td>
                            <td><FormattedDate>{waterRightDetail.allocationPriorityDate}</FormattedDate></td>
                            <td>{waterRightDetail.ownerClassication}</td>
                            <td>{waterRightDetail.allocationLegalStatus}</td>
                            <td>{waterRightDetail.allocationFlowCfs}</td>
                            <td>{waterRightDetail.allocationVolumeAf}</td>
                            <td>{waterRightDetail.beneficialUses.join(', ')}</td>
                        </tr>
                    })
                }
                {waterRightsSearchResults.waterRightsDetails?.length === 0 && !isFetchingTableData &&
                    <tr key="noResults">
                        <td colSpan={7} align="center">No results found</td>
                    </tr>
                }
                {hasMoreResults && !isFetchingTableData &&
                    <tr>
                        <td colSpan={7} align="center"><Button onClick={handleLoadMoreResults}>Load more results</Button></td>
                    </tr>
                }
                {isFetchingTableData &&
                    <tr>
                        <td colSpan={7} align="center">
                            Loading... <ProgressBar animated now={100} />
                        </td>
                    </tr>

                }
            </tbody>
        </Table>
    </>
}

export default AnalyticsDataTable;