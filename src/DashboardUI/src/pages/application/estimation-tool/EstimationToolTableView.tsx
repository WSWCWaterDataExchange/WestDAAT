import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Tab from 'react-bootstrap/esm/Tab';

import './estimation-tool-table-view.scss';
import EstimationToolFieldDataTable from './EstimationToolFieldDataTable';

interface EstimationToolTableViewProps {
  fields: string[];
}

function EstimationToolTableView(props: EstimationToolTableViewProps) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(props.fields[0]);

  const toggleshow = () => setShow(!show);

  return (
    <div className={`estimation-tool-table-view-container ${show ? 'expanded' : ''} `}>
      <div className="estimation-tool-table-view-slide-content">
        <div className="d-flex flex-column flex-grow-1">
          <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || props.fields[0])}>
            <Nav variant="tabs" className="py-2 px-3">
              {props.fields.map((field) => (
                <Nav.Item key={field}>
                  <Nav.Link eventKey={field}>{field}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="flex-grow-1 overflow-y-auto p-3">
              {props.fields.map((field) => (
                <Tab.Pane eventKey={field} key={field} className="h-100">
                  {show && activeTab === field && <EstimationToolFieldDataTable />}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      <Button type="button" className="estimation-tool-table-view-toggle-btn" variant="primary" onClick={toggleshow}>
        <span>DATA TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} size={1} />
      </Button>
    </div>
  );
}

export default EstimationToolTableView;
