import React from 'react';
import { useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import './tableView.scss';
import Icon from '@mdi/react';
import AnalyticsDataTable from './water-rights-tab/AnalyticsDataTable';
import PieCharts from './water-rights-tab/PieCharts';

function TableView() {
  const [show, setshow] = useState(false);
  const [activeTab, setActiveTab] = useState('pieChart');

  const toggleShow = () => setshow(!show);

  return (
    <>
      <Button
        type="button"
        className={`table-view-toggle-btn ${show ? 'toggle-on' : 'toggle-off'}`}
        onClick={toggleShow}
      >
        <span>ANALYTICS &amp; TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} />
      </Button>
      <div className={`analytics-and-table-content ${show ? 'toggle-on' : 'toggle-off'}`}>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab || 'pieChart')}
          id="analytics-and-table"
        >
          <Nav variant="tabs" defaultActiveKey="pieChart">
            <Nav.Item>
              <Nav.Link eventKey="pieChart">Chart Summary</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dataTable">Data Table</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="pieChart">{activeTab === 'pieChart' && show && <PieCharts />}</Tab.Pane>

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
