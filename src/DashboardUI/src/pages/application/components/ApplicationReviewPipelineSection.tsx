import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationFormSection from './ApplicationFormSection';

function ApplicationReviewPipelineSection() {
  const { state } = useConservationApplicationContext();

  return (
    <>
      <ApplicationFormSectionRule width={1} />
      <ApplicationFormSection title="Review Pipeline (Hidden from Applicant)" className="col mb-4">
        {state.conservationApplication.reviewPipeline.reviewSteps.map((step) => (
          <div key={step.reviewDate} className="mb-2">
            <pre>{JSON.stringify(step, null, 2)}</pre>
          </div>
        ))}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationReviewPipelineSection;
