import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Nav, Offcanvas, ProgressBar, Tab, Table } from "react-bootstrap";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";
import { useFindWaterRights, useGetAnalyticsSummaryInfo } from "../hooks/useWaterRightQuery";
import { WaterRightsSearchCriteria } from "../data-contracts/WaterRightsSearchCriteria";
import { WaterRightsSearchResults } from "../data-contracts/WaterRightsSearchResults";
import { FormattedDate } from "./FormattedDate";
import { FilterContext } from "../FilterProvider";
import moment from "moment";
import PieCharts from "./PieCharts";

interface TableViewProps {
  containerRef: React.MutableRefObject<any>;
}

function TableView(props: TableViewProps) {
  const _defaultResults = useMemo(() => ({ currentPageNumber: 0, hasMoreResults: false, waterRightsDetails: [] }), []);

  const [show, setshow] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);
  const [waterRightsSearchResults, setWaterRightsSearchResults] = useState<WaterRightsSearchResults>(_defaultResults);

  const { filters } = useContext(FilterContext);

  const handleClose = () => handleVisibilityChange(false);
  const toggleShow = () => handleVisibilityChange(!show);

  const handleVisibilityChange = (shouldShow: boolean) => {
    if (shouldShow) {
      handleFiltersChange();
    }
    else {
      setSearchCriteria(null);
      setWaterRightsSearchResults(_defaultResults);
    }
    setshow(shouldShow);
  }

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
      states: filters.states,
    });
  }, [_defaultResults, filters, setSearchCriteria, setWaterRightsSearchResults]);

  const handleLoadMoreResults = () => {
    if (waterRightsSearchResults.waterRightsDetails.length === 0) return;
    setSearchCriteria({ ...searchCriteria, pageNumber: waterRightsSearchResults.currentPageNumber + 1 })
  }

  const { data: latestSearchResults, isFetching: isFetchingTableData } = useFindWaterRights(searchCriteria)
  const { data: pieChartSearchResults, isFetching: isFetchingPieChartData } = useGetAnalyticsSummaryInfo(searchCriteria)

  useEffect(() => {
    if (show) {
      handleFiltersChange();
    }
  }, [filters, handleFiltersChange, show]);

  useEffect(() => {
    if (!latestSearchResults) return;

    setHasMoreResults(latestSearchResults.waterRightsDetails.length > 0 && latestSearchResults.hasMoreResults);

    setWaterRightsSearchResults(previousState => ({
      currentPageNumber: latestSearchResults.currentPageNumber,
      hasMoreResults: latestSearchResults.hasMoreResults,
      waterRightsDetails: [...previousState.waterRightsDetails, ...latestSearchResults.waterRightsDetails]
    }));
  }, [latestSearchResults, pieChartSearchResults]);

  return <>
    <Button type="button" className={`table-view-toggle-btn ${show ? "toggle-on" : null}`} onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={show ? mdiChevronDown : mdiChevronUp} size="1.5em" />
    </Button>
    <Tab.Container id="analytics-and-table" defaultActiveKey="dataTable">
      <Offcanvas
        className="offcanvas-analytics"
        show={show}
        onHide={handleClose}
        placement={'bottom'}
        backdrop={false}
        scroll={true}
        container={props.containerRef}>
        <Offcanvas.Body>
          <Nav variant="tabs" defaultActiveKey="dataTable">
            <Nav.Item>
              <Nav.Link eventKey="dataTable">Data Table</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pieChart">Pie Chart</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="dataTable">
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
                        <td>{waterRightDetail.allocationUuid}</td>
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
            </Tab.Pane>
            <Tab.Pane eventKey="pieChart">

              {pieChartSearchResults && pieChartSearchResults?.length > 0 &&
                <PieCharts dataByBeneficialUse={pieChartSearchResults}></PieCharts>
              }
              {pieChartSearchResults?.length === 0 && !isFetchingPieChartData &&
                <div className="d-flex justify-content-center">No results found</div>
              }
              {isFetchingPieChartData &&
                <div>
                  <div className="d-flex justify-content-center">Loading... </div><ProgressBar animated now={100} />
                </div>
              }
            </Tab.Pane>
          </Tab.Content>
        </Offcanvas.Body>
      </Offcanvas>
    </Tab.Container>
  </>
}

export default TableView;