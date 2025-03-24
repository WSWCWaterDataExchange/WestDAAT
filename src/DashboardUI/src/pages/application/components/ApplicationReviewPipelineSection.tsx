import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import ApplicationFormSection from './ApplicationFormSection';

function ApplicationReviewPipelineSection() {
  return (
    <>
      <hr className="text-primary" />
      <ApplicationFormSection title="Review Pipeline (Hidden from Applicant)" className="col mb-4">
        <NotImplementedPlaceholder />
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationReviewPipelineSection;
