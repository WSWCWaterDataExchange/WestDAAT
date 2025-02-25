import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Tab from 'react-bootstrap/esm/Tab';

interface EstimationToolTableViewProps {
  fields: string[];
}

function EstimationToolTableView(props: EstimationToolTableViewProps) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(props.fields[0]);

  const toggleshow = () => setShow(!show);

  return (
    <div className={`xyz ${show ? 'expanded' : ''} `}>
      <div className="abc">
        <div className="fields-tabs">
          <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || props.fields[0])}>
            <Nav variant="tabs">
              {props.fields.map((field) => (
                <Nav.Item key={field}>
                  <Nav.Link eventKey={field}>{field}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content>
              {props.fields.map((field) => (
                <Tab.Pane eventKey={field} key={field}>
                  {show && activeTab === field && <div>{field}</div>}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      <Button type="button" className="xyz-btn" onClick={toggleshow}>
        <span>DATA TABLE</span>
        <Icon path={show ? mdiChevronDown : mdiChevronUp} size={1} />
      </Button>
    </div>
  );
}

export default EstimationToolTableView;
