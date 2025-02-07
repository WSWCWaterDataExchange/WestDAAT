import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { mdiHelpCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { loginRequest } from '../../../authConfig';
import { isFeatureEnabled } from '../../../config/features';

function WaterRightHeader() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const overlayElement = (props: any) => (
    <Popover id="consumptive-use-btn-tooltip" {...props}>
      <Popover.Header as="h3">Lorem Ipsum</Popover.Header>
      <Popover.Body>Lorem ipsum dolor sit amet</Popover.Body>
    </Popover>
  );

  const consumptiveUseBtnClickHandler = () => {
    if (!isAuthenticated) {
      instance.loginRedirect(loginRequest).then(() => navigateToEstimationTool());
    } else {
      navigateToEstimationTool();
    }
  };

  const navigateToEstimationTool = () => {
    const { id } = routeParams;
    navigate(`/application/new/${id}`);
  };

  const shouldShowConsumptiveUseButton = isFeatureEnabled('conservationEstimationTool');

  return (
    <div className="d-flex flex-row align-items-center justify-content-between title-header">
      <div>
        <h3 className="d-flex fw-bold">WaDE Water Right Landing Page</h3>
      </div>

      {shouldShowConsumptiveUseButton && (
        <div className="d-flex flex-column align-items-end gap-1">
          <div className="d-flex flex-row gap-3 align-items-center">
            <div>
              <OverlayTrigger trigger="hover" placement="left" delay={{ show: 0, hide: 0 }} overlay={overlayElement}>
                <Icon path={mdiHelpCircleOutline} size="1.5em" />
              </OverlayTrigger>
            </div>
            <div>
              <Button variant="primary" onClick={consumptiveUseBtnClickHandler}>
                Estimate Consumptive Use
              </Button>
            </div>
          </div>
          <div>
            <span>
              By clicking this button, you are agreeing to WestDAAT’s{' '}
              <a href="https://westernstateswater.org/wade/westdaat-terms-of-service/" target="_blank" rel="noreferrer">
                Terms & Conditions
              </a>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaterRightHeader;
