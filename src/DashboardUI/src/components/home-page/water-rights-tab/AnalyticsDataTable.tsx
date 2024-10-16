import React from 'react';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ProgressBar, Table } from "react-bootstrap";
import { WaterRightsSearchResults } from "../../../data-contracts/WaterRightsSearchResults";
import { FormattedDate } from "../../FormattedDate";
import { useFindWaterRights } from "../../../hooks/queries/useWaterRightQuery";
import { useWaterRightsSearchCriteria } from "./hooks/useWaterRightsSearchCriteria";
import { formatNumber } from "../../../utilities/valueFormatters";

function AnalyticsDataTable() {
    const _defaultResults = useMemo(() => ({ currentPageNumber: 0, hasMoreResults: false, waterRightsDetails: [] }), []);

    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [waterRightsSearchResults, setWaterRightsSearchResults] = useState<WaterRightsSearchResults>(_defaultResults);
    const [pageNumber, setPageNumber] = useState(0);

    const {searchCriteria} = useWaterRightsSearchCriteria();

    useEffect(() =>{
        setPageNumber(0);
        setWaterRightsSearchResults(_defaultResults);
    }, [searchCriteria, _defaultResults]);

    const handleLoadMoreResults = useCallback(() => {
        setPageNumber(s=>s+1);
    }, [setPageNumber]);

    const searchCriteriaWithPaging = useMemo(() =>{
      return {
        ...searchCriteria,
        pageNumber
      }
    }, [pageNumber, searchCriteria])

    const { data: latestSearchResults, isFetching: isFetchingTableData } = useFindWaterRights(searchCriteriaWithPaging)

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
                            <td>{formatNumber(waterRightDetail.allocationFlowCfs)}</td>
                            <td>{formatNumber(waterRightDetail.allocationVolumeAf)}</td>
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