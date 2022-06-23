import { useContext, useEffect, useState } from "react";
import { Button, Nav, Offcanvas, ProgressBar, Tab, Table, Tabs } from "react-bootstrap";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";
import { useFindWaterRights, useWaterRightDetails } from "../hooks/useWaterRightQuery";
import { WaterRightsSearchCriteria } from "../data-contracts/WaterRightsSearchCriteria";
import { WaterRightsSearchResults } from "../data-contracts/WaterRightsSearchResults";
import { FormattedDate } from "./FormattedDate";
import { NavLink } from "react-router-dom";
import { MapContext } from "./MapProvider";

interface TableViewProps {
  containerRef: React.MutableRefObject<any>;
}

function TableView(props: TableViewProps) {
  const _defaultResults = { currentPageNumber: 0, waterRightsDetails: [] };

  const [show, setshow] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);
  const [waterRightsSearchResults, setWaterRightsSearchResults] = useState<WaterRightsSearchResults>(_defaultResults);

  const {filters} = useContext(MapContext);

  const handleClose = () => handleVisibilityChange(false);
  const toggleShow = () => handleVisibilityChange(!show);

  const handleVisibilityChange = (shouldShow: boolean) => {
    if (shouldShow) {
      setSearchCriteria({ pageNumber: 0 });
    }
    else {
      setSearchCriteria(null);
      setWaterRightsSearchResults(_defaultResults);
    }
    setshow(shouldShow);
  }

  const handleLoadMoreResults = () => {
    if (!waterRightsSearchResults) return;
    setSearchCriteria({ pageNumber: waterRightsSearchResults.currentPageNumber + 1, ...waterRightsSearchResults })
  }

  const { data: latestSearchResults, isFetching } = useFindWaterRights(searchCriteria)

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  useEffect(() => {
    if (!latestSearchResults) return;

    setHasMoreResults(latestSearchResults.waterRightsDetails.length > 0);

    setWaterRightsSearchResults(previousState => ({
      currentPageNumber: latestSearchResults.currentPageNumber,
      waterRightsDetails: [...previousState.waterRightsDetails, ...latestSearchResults.waterRightsDetails]
    }));
  }, [latestSearchResults]);

  return <>
    <Button type="button" className={`table-view-toggle-btn ${show ? "toggle-on" : null}`} onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={show ? mdiChevronDown : mdiChevronUp} size="1.5em" />
    </Button>
    <Tab.Container id="analytics-and-table" defaultActiveKey="dataTable">
      <Offcanvas
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
                  {
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
                  {hasMoreResults && !isFetching &&
                    <tr>
                      <td colSpan={7} align="center"><Button onClick={handleLoadMoreResults}>Load more results</Button></td>
                    </tr>
                  }
                  {isFetching &&
                    <tr>
                      <td colSpan={7} align="center">
                        Loading... <ProgressBar animated now={100} />
                      </td>
                    </tr>

                  }
                </tbody>
              </Table>
            </Tab.Pane>
          </Tab.Content>
        </Offcanvas.Body>
      </Offcanvas>
    </Tab.Container>
  </>
}

export default TableView;