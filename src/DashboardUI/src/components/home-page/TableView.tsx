import React from 'react';
import { useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import './tableView.scss';
import Icon from '@mdi/react';
import { DropdownOption } from '../../data-contracts/DropdownOption';
import AnalyticsDataTable from "./water-rights-tab/map-options/components/AnalyticsDataTable";
import Charts from "./water-rights-tab/map-options/components/Charts";

function TableView() {
  const [show, setshow] = useState(false);
  const [activeTab, setActiveTab] = useState('charts');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<DropdownOption | null>(null);

  const toggleShow = () => setshow(!show);

  return (
    <>
      <Button
        type="button"
        className={`table-view-toggle-btn ${show ? 'toggle-on' : 'toggle-off'}`}
        onClick={toggleShow}>
        <span>ANALYTICS &amp; TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} />
      </Button>
      <div className={`analytics-and-table-content ${show ? 'toggle-on' : 'toggle-off'}`}>
        <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || 'charts')} id="analytics-and-table">
          <Nav variant="tabs" defaultActiveKey="charts">
            <Nav.Item>
              <Nav.Link eventKey="charts">Chart Summary</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dataTable">Data Table</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="charts">
              {activeTab === 'charts' && show && (
                <Charts
                  selectedDropdownOption={selectedDropdownValue}
                  setSelectedDropdownOption={setSelectedDropdownValue}
                />
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="dataTable">
              {activeTab === 'dataTable' && show && <AnalyticsDataTable></AnalyticsDataTable>}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
}

export default TableView;
