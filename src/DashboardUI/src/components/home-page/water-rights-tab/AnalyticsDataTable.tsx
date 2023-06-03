import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, ProgressBar, Table } from "react-bootstrap";
import { WaterRightsSearchCriteria } from "../../../data-contracts/WaterRightsSearchCriteria";
import { WaterRightsSearchResults } from "../../../data-contracts/WaterRightsSearchResults";
import { FormattedDate } from "../../FormattedDate";
import { WaterRightsContext } from "./Provider";
import moment from "moment";
import { useFindWaterRights } from "../../../hooks/queries/useWaterRightQuery";

function AnalyticsDataTable() {
    const _defaultResults = useMemo(() => ({ currentPageNumber: 0, hasMoreResults: false, waterRightsDetails: [] }), []);

    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);
    const [waterRightsSearchResults, setWaterRightsSearchResults] = useState<WaterRightsSearchResults>(_defaultResults);

    const { filters, nldiIds } = useContext(WaterRightsContext);

    const handleFiltersChange = useCallback(() => {
        setWaterRightsSearchResults(_defaultResults);
        setSearchCriteria({
            pageNumber: 0,
            beneficialUses: filters.beneficialUseNames,
            filterGeometry: filters.polylines?.map(p => JSON.stringify(p.geometry)),
            exemptofVolumeFlowPriority: filters.includeExempt,
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
            wadeSitesUuids: nldiIds
        });
    }, [_defaultResults, filters.allocationOwner, filters.beneficialUseNames, filters.includeExempt, 
        filters.maxFlow, filters.maxPriorityDate, filters.maxVolume, filters.minFlow, filters.minPriorityDate, 
        filters.minVolume, filters.ownerClassifications, filters.podPou, filters.polylines, filters.riverBasinNames, 
        filters.states, filters.waterSourceTypes, 
        nldiIds]); //there are properties on the filters object that need to be ignored, so the properties to subscribe to must be explicitly listed

    const handleLoadMoreResults = () => {
        if (waterRightsSearchResults.waterRightsDetails.length === 0) return;
        setSearchCriteria({ ...searchCriteria, pageNumber: waterRightsSearchResults.currentPageNumber + 1 })
    }

    const { data: latestSearchResults, isFetching: isFetchingTableData } = useFindWaterRights(searchCriteria)

    useEffect(() => {
        handleFiltersChange();
    }, [filters.allocationOwner, filters.beneficialUseNames, filters.includeExempt, filters.maxFlow, filters.maxPriorityDate, 
        filters.maxVolume, filters.minFlow, filters.minPriorityDate, filters.minVolume, filters.ownerClassifications, 
        filters.podPou, filters.polylines, filters.riverBasinNames, filters.states, filters.waterSourceTypes, 
        handleFiltersChange]);

    useEffect(() => {
        if (!latestSearchResults) return;

        setHasMoreResults(latestSearchResults.waterRightsDetails.length > 0 && latestSearchResults.hasMoreResults);

        setWaterRightsSearchResults(previousState => ({
            currentPageNumber: latestSearchResults.currentPageNumber,
            hasMoreResults: latestSearchResults.hasMoreResults,
            waterRightsDetails: [...previousState.waterRightsDetails, ...latestSearchResults.waterRightsDetails]
        }));
    }, [latestSearchResults]);

    return <Table>
            <thead>
                <tr>
                    <th>Allocation UUID</th>
                    <th>Priority Date</th>
                    <th>WaDE Owner Classification</th>
                    <th>Owner</th>
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
                            <td>{waterRightDetail.ownerClassification}</td>
                            <td>{waterRightDetail.allocationOwner}</td>
                            <td>{waterRightDetail.allocationLegalStatus}</td>
                            <td>{waterRightDetail.allocationFlowCfs?.toLocaleString()}</td>
                            <td>{waterRightDetail.allocationVolumeAf?.toLocaleString()}</td>
                            <td>{waterRightDetail.beneficialUses.join(', ')}</td>
                        </tr>
                    })
                }
                {waterRightsSearchResults.waterRightsDetails?.length === 0 && !isFetchingTableData &&
                    <tr key="noResults">
                        <td colSpan={8} align="center">No results found</td>
                    </tr>
                }
                {hasMoreResults && !isFetchingTableData &&
                    <tr>
                        <td colSpan={8} align="center"><Button onClick={handleLoadMoreResults}>Load more results</Button></td>
                    </tr>
                }
                {isFetchingTableData &&
                    <tr>
                        <td colSpan={8} align="center">
                            Loading... <ProgressBar animated now={100} />
                        </td>
                    </tr>
                }
            </tbody>
        </Table>
}

export default AnalyticsDataTable;