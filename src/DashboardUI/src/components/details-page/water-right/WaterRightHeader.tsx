import { mdiHelpCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

function WaterRightHeader() {
  const overlayTooltip = <Tooltip id="consumptive-use-btn-tooltip">lorem ipsum dolor sit amet</Tooltip>;

  return (
    <div className="d-flex flex-row align-items-center justify-content-between title-header">
      <div>
        <h3 className="d-flex fw-bold">WaDE Water Right Landing Page</h3>
      </div>

      <div className="d-flex flex-column align-items-end gap-1">
        <div className="d-flex flex-row gap-3 align-items-center">
          <div>
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={overlayTooltip}>
              <Icon path={mdiHelpCircleOutline} size="1.5em" />
            </OverlayTrigger>
          </div>
          <div>
            <Button variant="primary">Estimate Consumptive Use</Button>
          </div>
        </div>
        <div>
          <span>
            By clicking this button, you are agreeing to WestDAAT’s{' '}
            <a href="https://westernstateswater.org/wade/westdaat-terms-of-service/">Terms & Conditions</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default WaterRightHeader;
