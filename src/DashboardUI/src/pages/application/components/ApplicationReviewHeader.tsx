import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export interface ApplicationReviewHeaderProps {
  additionalText?: string;
}

function ApplicationReviewHeader(props: ApplicationReviewHeaderProps) {
  const { state } = useConservationApplicationContext();

  return (
    <>
      <div className="d-flex gap-3 my-4">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div className="mb-4">
        <span>{props.additionalText}</span>
      </div>
    </>
  );
}

export default ApplicationReviewHeader;
