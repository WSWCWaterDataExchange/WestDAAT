import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Tab from 'react-bootstrap/esm/Tab';
import EstimationToolFieldDataTable from './EstimationToolFieldDataTable';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { PolygonEtDataCollection } from '../../../data-contracts/PolygonEtDataCollection';

import './estimation-tool-table-view.scss';

function EstimationToolTableView() {
  const { state } = useConservationApplicationContext();
  const fields = state.conservationApplication.polygonEtData;

  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const toggleShow = () => setShow(!show);

  useEffect(
    function showDataTableOnceDataIsAvailable() {
      const hasPerformedEstimation = fields.length > 0;
      if (!hasPerformedEstimation) {
        return;
      }

      setTimeout(() => {
        // wait a few seconds to allow the user to notice the map zooming in
        setActiveTab(fields[0].fieldName);
        setShow(true);
      }, 1000);
    },
    [fields],
  );

  const getFieldAcres = (field: PolygonEtDataCollection & { fieldName: string }): number => {
    return state.conservationApplication.selectedMapPolygons.find((polygon) => polygon.polygonWkt === field.polygonWkt)!
      .acreage;
  };

  return (
    <div
      className={`estimation-tool-table-view-container ${show ? 'expanded' : ''} d-flex flex-column position-absolute start-0 end-0 bottom-0`}
    >
      <div className="estimation-tool-table-view-slide-content flex-grow-1 d-flex flex-column">
        <div className="d-flex flex-column flex-grow-1 h-100">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab || (fields.length > 0 ? fields[0].fieldName : ''))}
          >
            <Nav variant="tabs" className="py-2 px-3">
              {fields.map((field) => (
                <Nav.Item key={field.fieldName}>
                  <Nav.Link eventKey={field.fieldName}>{field.fieldName}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="flex-grow-1 overflow-y-auto p-3">
              {fields.length === 0 && (
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-muted">No data available. Please request an estimate.</span>
                </div>
              )}

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

      <Button
        type="button"
        className="estimation-tool-table-view-toggle-btn d-flex align-items-center justify-content-center py-2 px-4"
        variant="primary"
        onClick={toggleShow}
      >
        <span>DATA TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} size={1} />
      </Button>
    </div>
  );
}

export default EstimationToolTableView;
