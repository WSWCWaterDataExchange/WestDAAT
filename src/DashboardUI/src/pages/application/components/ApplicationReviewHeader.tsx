import Icon from '@mdi/react';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { mdiCircle } from '@mdi/js';
import {
  ConservationApplicationStatusDisplayNames,
  getApplicationStatusIconClass,
} from '../../../data-contracts/ConservationApplicationStatus';

export interface ApplicationReviewHeaderProps {
  additionalText?: string;
}

function ApplicationReviewHeader(props: ApplicationReviewHeaderProps) {
  const { state } = useConservationApplicationContext();

  return (
    <div className="my-4">
      <div className="d-flex">
        <h1 className="fs-4 fw-bold">Application for Water Right Native ID: {state.conservationApplication.waterRightNativeId}</h1>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <Icon
          size={0.7}
          path={mdiCircle}
          className={`flex-shrink-0 ` + getApplicationStatusIconClass(state.conservationApplication.status)}
        />
        {ConservationApplicationStatusDisplayNames[state.conservationApplication.status]}
      </div>
      <div className="d-flex gap-3">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div className="mb-4">
        <span>{props.additionalText}</span>
      </div>
    </div>
  );
}

export default ApplicationReviewHeader;
