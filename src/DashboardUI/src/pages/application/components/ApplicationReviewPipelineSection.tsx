import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import ApplicationFormSection from './ApplicationFormSection';

function ApplicationReviewPipelineSection() {
  return (
    <>
      <ApplicationFormSectionRule width={1} />
      <ApplicationFormSection title="Review Pipeline (Hidden from Applicant)" className="col mb-4">
        <NotImplementedPlaceholder />
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationReviewPipelineSection;
