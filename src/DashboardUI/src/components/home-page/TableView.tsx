import React, { useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import './tableView.scss';
import Icon from '@mdi/react';
import { DropdownOption } from '../../data-contracts/DropdownOption';
import AnalyticsDataTable from './water-rights-tab/map-options/components/AnalyticsDataTable';
import Charts from './water-rights-tab/map-options/components/Charts';

function TableView() {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('charts');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<DropdownOption | null>(null);

  const toggleShow = () => setShow(!show);

  return (
    <div className={`table-view-container ${show ? 'expanded' : ''}`}>
      <div className="table-view-slide-content">
        <div className="analytics-and-table-tabs">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab || 'charts')}
            id="analytics-and-table"
          >
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="charts">Chart Summary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="dataTable">Data Table</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="charts">
                {show && activeTab === 'charts' && (
                  <Charts
                    selectedDropdownOption={selectedDropdownValue}
                    setSelectedDropdownOption={setSelectedDropdownValue}
                  />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="dataTable">{show && activeTab === 'dataTable' && <AnalyticsDataTable />}</Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      <Button type="button" className="table-view-toggle-btn" onClick={toggleShow}>
        <span>ANALYTICS &amp; TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} size={1} />
      </Button>
    </div>
  );
}

export default TableView;
