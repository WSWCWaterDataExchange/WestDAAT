import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Tab from 'react-bootstrap/esm/Tab';

import './estimation-tool-table-view.scss';
import EstimationToolFieldDataTable from './EstimationToolFieldDataTable';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { PolygonEtDataCollection } from '../../../data-contracts/PolygonEtDataCollection';
import { formatNumber } from '../../../utilities/valueFormatters';

function EstimationToolTableView() {
  const { state } = useConservationApplicationContext();
  const fields = state.conservationApplication.polygonEtData;

  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(fields[0].fieldName);

  const toggleshow = () => setShow(!show);

  const getFieldAcres = (field: PolygonEtDataCollection & { fieldName: string }): number => {
    return state.conservationApplication.selectedMapPolygons.find((polygon) => polygon.polygonWkt === field.polygonWkt)!
      .acreage;
  };

  return (
    <div className={`estimation-tool-table-view-container ${show ? 'expanded' : ''} `}>
      <div className="estimation-tool-table-view-slide-content">
        <div className="d-flex flex-column flex-grow-1">
          <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || fields[0].fieldName)}>
            <Nav variant="tabs" className="py-2 px-3">
              {fields.map((field) => (
                <Nav.Item key={field.fieldName}>
                  <Nav.Link eventKey={field.fieldName}>{field.fieldName}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="flex-grow-1 overflow-y-auto p-3">
              {fields.map((field) => (
                <Tab.Pane eventKey={field.fieldName} key={field.fieldName} className="h-100">
                  {show && activeTab === field.fieldName && (
                    <EstimationToolFieldDataTable data={field} fieldAcreage={getFieldAcres(field)} />
                  )}
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
