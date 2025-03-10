import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { useNavigate, useParams } from 'react-router-dom';
import { loginRequest } from '../../../authConfig';
import { isFeatureEnabled } from '../../../config/features';
import { useState } from 'react';
import { OverlayTooltip } from '../../OverlayTooltip';
import { useWaterRightDetailsContext } from './Provider';

function WaterRightHeader() {
  const {
    hostData: {
      detailsQuery: { data: details, isLoading: isLoadingDetails },
    },
  } = useWaterRightDetailsContext();

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
  const isConsumptiveUseButtonDisabled = isLoadingDetails || !details?.isConservationApplicationEligible;

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
                <OverlayTooltip text="Only available to those water rights approved to take part in a Funding Organization’s available water use reduction program. Uses OpenET’s consumptive use estimate to help determine potential water savings and monetary compensation for voluntary efforts towards water savings." />
              </div>
              <div>
                {isLoadingDetails && (
                  <Placeholder animation="glow">
                    <Placeholder xs={12} className="rounded" style={{ width: '200px' }} />
                  </Placeholder>
                )}

                {!isLoadingDetails && (
                  <Button
                    variant={isConsumptiveUseButtonDisabled ? 'secondary' : 'primary'}
                    onClick={consumptiveUseBtnClickHandler}
                    disabled={isConsumptiveUseButtonDisabled}
                  >
                    Estimate Consumptive Use
                  </Button>
                )}
              </div>
            </div>
            <div>
              {isLoadingDetails && (
                <Placeholder animation="glow">
                  <Placeholder xs={12} className="rounded" style={{ width: '400px' }} />
                </Placeholder>
              )}

              {!isLoadingDetails && (
                <>
                  <span>
                    {!details?.isConservationApplicationEligible && <>This water right is not eligible.</>}

                    {details?.isConservationApplicationEligible && (
                      <>
                        <span className="me-1">By clicking this button, you are agreeing to WestDAAT’s</span>

                        <a
                          href="https://westernstateswater.org/wade/westdaat-terms-of-service/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Terms & Conditions
                        </a>
                      </>
                    )}
                  </span>
                </>
              )}
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
