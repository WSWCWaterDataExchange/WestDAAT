import { useNavigate } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { formatNumber } from '../../../utilities/valueFormatters';
import {
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
} from '../../../data-contracts/CompensationRateUnits';
import Button from 'react-bootstrap/esm/Button';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import ApplicationFormSection from '../components/ApplicationFormSection';
import Modal from 'react-bootstrap/esm/Modal';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useMsal } from '@azure/msal-react';
import { submitApplication } from '../../../accessors/applicationAccessor';
import { toast } from 'react-toastify';
import { mdiFileDocument } from '@mdi/js';
import Icon from '@mdi/react';

export function ApplicationReviewPage() {
  const { state } = useConservationApplicationContext();
  const [showSubmissionConfirmationModal, setShowSubmissionConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const context = useMsal();

  const navigateToApplicationCreatePage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/create`);
  };

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${state.conservationApplication.waterRightNativeId}`);
  };

  const presentConfirmationModal = () => {
    setShowSubmissionConfirmationModal(true);
  };

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      const waterConservationApplicationId = state.conservationApplication.waterConservationApplicationId!;

      let alertString = `Submitting application documents - not yet implemented.\n\n
        Files being submitted:\n\n`;
      state.conservationApplication.supportingDocuments.forEach((file, index) => {
        alertString += `File #${index + 1}: ${file.fileName}\n   (description: '${file.description ?? '(no text entered)'}')\n\n`;
      });
      alert(alertString);

      return await submitApplication(context, {
        waterConservationApplicationId,
        waterRightNativeId: state.conservationApplication.waterRightNativeId!,
        form: state.conservationApplication.applicationSubmissionForm,
      });
    },
    onSuccess: () => {
      navigateToWaterRightLandingPage();

      // the notification doesn't appear unless it's delayed until after navigation
      setTimeout(() => {
        toast.success('Application submitted successfully.');
      }, 1);
    },
    onError: (error) => {
      toast.error('Failed to submit application. Please try again.');
    },
  });

  const handleModalCancel = () => {
    setShowSubmissionConfirmationModal(false);
  };

  const handleModalConfirm = async () => {
    await submitApplicationMutation.mutateAsync();
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationCreatePage}
        backButtonText="Back to Application"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <ApplicationReviewPageLayout submitApplication={presentConfirmationModal} />
      </div>

      <SubmitApplicationConfirmationModal
        show={showSubmissionConfirmationModal}
        cancelSubmission={handleModalCancel}
        confirmSubmission={handleModalConfirm}
      />
    </div>
  );
}

const responsiveOneQuarterWidthDefault = 'col-lg-3 col-md-4 col-12';
const responsiveOneThirdWidthDefault = 'col-lg-4 col-md-6 col-12';
const responsiveHalfWidthDefault = 'col-lg-6 col-12';

interface ApplicationReviewPageLayoutProps {
  submitApplication: () => void;
}

function ApplicationReviewPageLayout(props: ApplicationReviewPageLayoutProps) {
  const { state } = useConservationApplicationContext();
  const stateForm = state.conservationApplication.applicationSubmissionForm;
  const polygonData = state.conservationApplication.estimateLocations;

  // not combined with the section component because of the one-off case of the "Property & Land Area Information" section
  const sectionRule = <hr className="text-primary" style={{ borderWidth: 2 }} />;

  return (
    <div className="container">
      <div className="mb-3">
        <span className="fs-4 fw-bold">
          Application for Water Right Native ID: {state.conservationApplication.waterRightNativeId}
        </span>
      </div>

      <div className="d-flex gap-3 mb-4">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div>
        <ApplicationFormSection title="Applicant Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Landowner Name" displayValue={stateForm.landownerName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Email Address" displayValue={stateForm.landownerEmail} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Phone" displayValue={stateForm.landownerPhoneNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Address" displayValue={stateForm.landownerAddress} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="City" displayValue={stateForm.landownerCity} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="State" displayValue={stateForm.landownerState} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Zip Code" displayValue={stateForm.landownerZipCode} />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <ApplicationFormSection title="Representative / Agent Contact Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Name / Organization" displayValue={stateForm.agentName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Email" displayValue={stateForm.agentEmail} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Phone" displayValue={stateForm.agentPhoneNumber} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement label="Additional Details" displayValue={stateForm.agentAdditionalDetails} />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <div className="row">
          <ApplicationFormSection title="Property & Land Area Information" className="col-lg-6 col-12">
            {polygonData.map((field) => (
              <div className="row mb-4" key={field.fieldName}>
                <div className="col-3">
                  <span className="text-muted">{field.fieldName}</span>
                </div>
                <div className="col-3">
                  <span className="text-muted">Acres: </span>
                  <span>{formatNumber(field.acreage, 2)}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted">Location: </span>
                  <span>
                    ({field.centerPoint!.coordinates[1]}, {field.centerPoint!.coordinates[0]})
                  </span>
                </div>
                <div className={`col-12 mb-4`}>
                  <FormElement label="Additional Details" displayValue={field.additionalDetails} />
                </div>
              </div>
            ))}
          </ApplicationFormSection>

          <div className="col-lg-6 col-12">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        {sectionRule}

        <ApplicationFormSection title="Canal Company / Irrigation District">
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElement label="Name / Organization" displayValue={stateForm.canalOrIrrigationEntityName} />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElement label="Email" displayValue={stateForm.canalOrIrrigationEntityEmail} />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElement label="Phone" displayValue={stateForm.canalOrIrrigationEntityPhoneNumber} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement label="Additional Details" displayValue={stateForm.canalOrIrrigationAdditionalDetails} />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <ApplicationFormSection title="Water Right Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Permit #" displayValue={stateForm.permitNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Facility (Ditch) Name" displayValue={stateForm.facilityDitchName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Priority Date" displayValue={stateForm.priorityDate} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Certificate #" displayValue={stateForm.certificateNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Share #" displayValue={stateForm.shareNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="State" displayValue={stateForm.waterRightState} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement label="Description of Water Use" displayValue={stateForm.waterUseDescription} />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <ApplicationFormSection title="Estimation Summary">
          <div className="row">
            <div className="col-sm-6 col-md-3 mb-4">
              <FormElement
                label="Irrigated Field Area"
                displayValue={formatNumber(state.conservationApplication.polygonAcreageSum, 2) + ' Acres'}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElement
                label="Consumptive Use"
                displayValue={formatNumber(state.conservationApplication.polygonEtAcreFeetSum, 2) + ' Acre-Feet'}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElement
                label="Compensation Rate"
                displayValue={`$${state.conservationApplication.desiredCompensationDollars}/${CompensationRateUnitsLabelsSingular[state.conservationApplication.desiredCompensationUnits!]}`}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElement
                label="Requested Total ($)"
                displayValue={'$' + formatNumber(state.conservationApplication.conservationPayment, 0)}
              />
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement
              label="Supplementary Review Information"
              displayValue={stateForm.estimationSupplementaryDetails}
            />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <ApplicationFormSection title="Conservation Plan">
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElement
              label="Funding Request $ Amount"
              displayValue={'$' + stateForm.conservationPlanFundingRequestDollarAmount}
            />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElement
              label="Units"
              displayValue={
                CompensationRateUnitsLabelsPlural[stateForm.conservationPlanFundingRequestCompensationRateUnits!]
              }
            />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement label="Conservation Description" displayValue={stateForm.conservationPlanDescription} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElement label="Additional Information" displayValue={stateForm.conservationPlanAdditionalInfo} />
          </div>
        </ApplicationFormSection>

        {sectionRule}

        <ApplicationFormSection title="Supporting Documents">
          <div className="col mb-4">
            {state.conservationApplication.supportingDocuments.length > 0 && (
              <table className="table">
                <tbody>
                  {state.conservationApplication.supportingDocuments.map((file, index) => (
                    <tr key={`${file.fileName}-${index}`}>
                      <td className="align-content-center px-2">
                        <Icon path={mdiFileDocument} size="2em" className="primary p-1" color={'#007bff'}></Icon>
                        {file.fileName}
                      </td>
                      <td className="align-content-center text-start">{file.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ApplicationFormSection>

        <hr className="m-0" />
        <div className="d-flex justify-content-end p-3">
          <Button variant="success" type="button" onClick={props.submitApplication}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormElementProps {
  label: string;
  displayValue: any;
}

function FormElement(props: FormElementProps) {
  const { label, displayValue } = props;

  return (
    <>
      <div>
        <span className="text-muted">{label}</span>
      </div>
      <div>
        <span>{displayValue || '-'}</span>
      </div>
    </>
  );
}

interface SubmitApplicationConfirmationModalProps {
  show: boolean;
  cancelSubmission: () => void;
  confirmSubmission: () => void;
}

function SubmitApplicationConfirmationModal(props: SubmitApplicationConfirmationModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={() => props.cancelSubmission()}>
        <Modal.Title>Submit for Review?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          Are you sure you want to submit this application? Once submitted, the application cannot be edited or resent.
        </div>

        <div className="mb-2">The following organizations will be able to see your application:</div>

        <div>
          <ol>
            <li>Conservation Organization</li>
            <li>Technical Reviewer</li>
            <li>WestDAAT Admin (View Only)</li>
            <li>Copy to You</li>
          </ol>
        </div>

        <div>By submitting this application, I hereby declare that the information provided is true and correct</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.cancelSubmission()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => props.confirmSubmission()}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
