import Icon from '@mdi/react';
import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationFormSection from './ApplicationFormSection';
import { mdiCircle } from '@mdi/js';
import {
  getApplicationReviewStepIconClass,
  ReviewStepStatusDisplayNames,
} from '../../../data-contracts/ReviewStepStatus';
import { ReviewStepTypeDisplayNames } from '../../../data-contracts/ReviewStepType';
import { formatDateString, momentJsLocalizedDateFormatString } from '../../../utilities/valueFormatters';

function ApplicationReviewPipelineSection() {
  const { state } = useConservationApplicationContext();

  return (
    <>
      <ApplicationFormSectionRule width={1} />
      <ApplicationFormSection title="Review Pipeline (Hidden from Applicant)" className="col mb-4">
        {state.conservationApplication.reviewPipeline.reviewSteps.map((step) => (
          <div key={step.reviewDate} className="row mb-1">
            <div className="col-xl-3 col-sm-6 d-flex align-items-center gap-2 text-nowrap">
              <Icon size={0.7} path={mdiCircle} className={getApplicationReviewStepIconClass(step.reviewStepStatus)} />
              {ReviewStepStatusDisplayNames[step.reviewStepStatus]}
            </div>
            <div className="col-xl-2 col-sm-6">
              <span className="fw-bold">{ReviewStepTypeDisplayNames[step.reviewStepType]}</span>
            </div>
            <div className="col-xl-7 col-sm-12 d-flex align-items-center gap-3">
              <span>{step.participantName}</span>
              <span className="fst-italic text-muted">
                {formatDateString(step.reviewDate, momentJsLocalizedDateFormatString)}
              </span>
            </div>
          </div>
        ))}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationReviewPipelineSection;
