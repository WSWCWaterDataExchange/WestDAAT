import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Tab from 'react-bootstrap/esm/Tab';
import EstimationToolFieldDataTable from './EstimationToolFieldDataTable';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

import './estimation-tool-table-view.scss';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

interface EstimationToolTableViewProps {
  perspective: ApplicationReviewPerspective;
}

function EstimationToolTableView(props: EstimationToolTableViewProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const polygons = state.conservationApplication.estimateLocations;
  const show = state.displayDataTable;

  const [activeTab, setActiveTab] = useState<string | undefined>();

  const toggleShow = () => dispatch({ type: 'DATA_TABLE_TOGGLED' });

  useEffect(() => {
    if (!show) {
      return;
    }

    setActiveTab(polygons[0].fieldName);
  }, [show, polygons]);

  return (
    <div
      className={`estimation-tool-table-view-container ${show ? 'expanded' : ''} d-flex flex-column position-absolute start-0 end-0 bottom-0`}
    >
      <div className="estimation-tool-table-view-slide-content flex-grow-1 d-flex flex-column">
        <div className="d-flex flex-column flex-grow-1 h-100">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab || (polygons.length > 0 ? polygons[0].polygonWkt : undefined))}
          >
            <Nav variant="tabs" className="py-2 px-3">
              {polygons.map((field) => (
                <Nav.Item key={field.polygonWkt}>
                  <Nav.Link eventKey={field.polygonWkt}>{field.fieldName}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="flex-grow-1 overflow-y-auto p-3">
              {polygons.length === 0 && (
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-muted">No data available. Please request an estimate.</span>
                </div>
              )}

              {polygons.map((field) => (
                <Tab.Pane eventKey={field.polygonWkt} key={field.polygonWkt} className="h-100">
                  {show && activeTab === field.polygonWkt && (
                    <EstimationToolFieldDataTable
                      perspective={props.perspective}
                      data={{
                        waterConservationApplicationEstimateLocationId:
                          field.waterConservationApplicationEstimateLocationId!,
                        polygonWkt: field.polygonWkt!,
                        averageYearlyTotalEtInInches: field.averageYearlyTotalEtInInches,
                        averageYearlyNetEtInInches: field.averageYearlyNetEtInInches,
                        datapoints: field.datapoints,
                      }}
                      fieldAcreage={field.acreage!}
                    />
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
