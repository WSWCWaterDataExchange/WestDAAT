import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

interface ApplicationReviewHeaderProps {
  perspective: ApplicationReviewPerspective;
}

function ApplicationReviewHeader(props: ApplicationReviewHeaderProps) {
  const { perspective } = props;
  const { state } = useConservationApplicationContext();

  const pageTitleOptions: Record<ApplicationReviewPerspective, string> = {
    applicant: 'New Application',
    reviewer: 'Application',
  };

  return (
    <>
      <div className="mb-3">
        <span className="fs-4 fw-bold">{pageTitleOptions[perspective]}</span>
      </div>

      <div className="d-flex gap-3 mb-4">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div className="mb-4">
        <span>
          Complete the below fields in order to submit your application to your state agency for verification. Be sure
          everything is filled out accurately and truthfully.
        </span>
      </div>
    </>
  );
}

export default ApplicationReviewHeader;
