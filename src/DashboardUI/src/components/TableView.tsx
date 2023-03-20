import { useState } from "react";
import { Button, Nav, Offcanvas, Tab } from "react-bootstrap";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";
import PieCharts from "./PieCharts";
import AnalyticsDataTable from "./AnalyticsDataTable";

interface TableViewProps {
  containerRef: React.MutableRefObject<any>;
}

function TableView(props: TableViewProps) {

  const [show, setshow] = useState(false);
  const [activeTab, setActiveTab] = useState('pieChart');

  const handleClose = () => handleVisibilityChange(false);
  const toggleShow = () => handleVisibilityChange(!show);

  const handleVisibilityChange = (shouldShow: boolean) => {
    setshow(shouldShow);
  }

  return <>
    <Button type="button" className={`table-view-toggle-btn ${show ? "toggle-on" : null}`} onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={show ? mdiChevronDown : mdiChevronUp} size="1.5em" />
    </Button>
    <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || 'pieChart')} id="analytics-and-table">
      <Offcanvas
        className="offcanvas-analytics"
        show={show}
        onHide={handleClose}
        placement={'bottom'}
        backdrop={false}
        scroll={true}
        container={props.containerRef}>
        <Offcanvas.Body>
          <Nav variant="tabs" defaultActiveKey="pieChart">           
            <Nav.Item>
              <Nav.Link eventKey="pieChart">Pie Chart</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dataTable">Data Table</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="pieChart">
              {activeTab === 'pieChart' && show &&
                <PieCharts></PieCharts>
              }
            </Tab.Pane>
            <Tab.Pane eventKey="dataTable">
              {activeTab === 'dataTable' && show &&
                <AnalyticsDataTable></AnalyticsDataTable>
              }
            </Tab.Pane>
          </Tab.Content>
        </Offcanvas.Body>
      </Offcanvas>
    </Tab.Container>
  </>
}

export default TableView;