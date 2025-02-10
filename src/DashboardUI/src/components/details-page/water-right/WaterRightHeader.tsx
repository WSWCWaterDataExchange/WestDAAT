import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { mdiHelpCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { loginRequest } from '../../../authConfig';
import { isFeatureEnabled } from '../../../config/features';
import { useState } from 'react';
import { OverlayTooltip } from '../../OverlayTooltip';

function WaterRightHeader() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);

  const consumptiveUseBtnClickHandler = () => {
    if (!isAuthenticated) {
      setShowLoginPromptModal(true);
    } else {
      navigateToEstimationTool();
    }
  };

  const activateLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const navigateToEstimationTool = () => {
    const { id } = routeParams;
    navigate(`/application/${id}/estimation`);
  };

  const shouldShowConsumptiveUseButton = isFeatureEnabled('conservationEstimationTool');

  return (
    <div className="d-flex flex-row align-items-center justify-content-between title-header">
      <div>
        <span className="fs-3 fw-bold">WaDE Water Right Landing Page</span>
      </div>

      {shouldShowConsumptiveUseButton && (
        <>
          <div className="d-flex flex-column align-items-end gap-1">
            <div className="d-flex flex-row gap-3 align-items-center">
              <div>
                <OverlayTooltip
                  text="Estimate the amount of water consumed (not returned) based on available data, including water rights, use
        records, and supply inputs."
                />
              </div>
              <div>
                <Button variant="primary" onClick={consumptiveUseBtnClickHandler}>
                  Estimate Consumptive Use
                </Button>
              </div>
            </div>
            <div>
              <span>
                <span className="me-1">By clicking this button, you are agreeing to WestDAAT’s</span>

                <a
                  href="https://westernstateswater.org/wade/westdaat-terms-of-service/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms & Conditions
                </a>
              </span>
            </div>
          </div>

          <Modal show={showLoginPromptModal} centered>
            <Modal.Header closeButton onClick={() => setShowLoginPromptModal(false)}>
              <Modal.Title>Login for Access to the Estimator</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                Sign up for a <strong>completely free</strong> account to access the consumptive use estimation tool or
                apply for funding.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowLoginPromptModal(false)}>
                Cancel
              </Button>
              <Button onClick={activateLogin}>Sign up</Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}

export default WaterRightHeader;
