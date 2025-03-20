import Placeholder from 'react-bootstrap/esm/Placeholder';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationFormSection from './ApplicationFormSection';
import Button from 'react-bootstrap/esm/Button';
import Icon from '@mdi/react';
import { mdiFileDocument } from '@mdi/js';
import { formatDateString, formatNumber } from '../../../utilities/valueFormatters';
import {
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
} from '../../../data-contracts/CompensationRateUnits';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

const responsiveOneQuarterWidthDefault = 'col-lg-3 col-md-4 col-sm-6 col-12';
const responsiveOneThirdWidthDefault = 'col-lg-4 col-md-6 col-sm-6 col-12';
const responsiveHalfWidthDefault = 'col-lg-6 col-12';

interface ApplicationReviewFormProps {
  isLoading: boolean;
  submitApplication: () => void;
}

function ApplicationReviewForm(props: ApplicationReviewFormProps) {
  const { state } = useConservationApplicationContext();
  const stateForm = state.conservationApplication.applicationSubmissionForm;
  const polygonData = state.conservationApplication.estimateLocations;

  const isApplicationSubmitEnabled = state.isCreatingApplication;

  // not combined with the section component because of the one-off case of the "Property & Land Area Information" section
  const sectionRule = <hr className="text-primary" style={{ borderWidth: 2 }} />;

  return (
    <main className="container">
      <div className="mb-3">
        <span className="fs-4 fw-bold">
          Application for Water Right Native ID: {state.conservationApplication.waterRightNativeId}
        </span>
      </div>

      <div className="d-flex gap-3 mb-4">
        {props.isLoading ? (
          <Placeholder as="div" animation="glow" className="h-100 w-100">
            <Placeholder xs={12} className="h-100 w-25 rounded" />
          </Placeholder>
        ) : (
          <>
            <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

            <span className="fw-bold">
              Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
            </span>

            <span className="fw-bold">
              Funding Organization: {state.conservationApplication.fundingOrganizationName}
            </span>
          </>
        )}
      </div>
      <div>
        <ApplicationFormSection title="Applicant Information" isLoading={props.isLoading} loadingFieldCount={7}>
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

        <ApplicationFormSection
          title="Representative / Agent Contact Information"
          isLoading={props.isLoading}
          loadingFieldCount={3}
        >
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
          <ApplicationFormSection
            title="Property & Land Area Information"
            className="col-lg-6 col-12"
            isLoading={props.isLoading}
          >
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

        <ApplicationFormSection
          title="Canal Company / Irrigation District"
          isLoading={props.isLoading}
          loadingFieldCount={3}
        >
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

        <ApplicationFormSection title="Water Right Information" isLoading={props.isLoading} loadingFieldCount={7}>
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Permit #" displayValue={stateForm.permitNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement label="Facility (Ditch) Name" displayValue={stateForm.facilityDitchName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElement
              label="Priority Date"
              displayValue={stateForm.priorityDate ? formatDateString(stateForm.priorityDate, 'MM/DD/YYYY') : undefined}
            />
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

        <ApplicationFormSection title="Estimation Summary" isLoading={props.isLoading} loadingFieldCount={5}>
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
                displayValue={
                  formatNumber(state.conservationApplication.totalAverageYearlyEtAcreFeet, 2) + ' Acre-Feet'
                }
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

        <ApplicationFormSection title="Conservation Plan" isLoading={props.isLoading} loadingFieldCount={2}>
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
            {state.conservationApplication.supportingDocuments.length === 0 && (
              <div className="text-muted">(No supporting documents have been provided)</div>
            )}

            {state.conservationApplication.supportingDocuments.length > 0 && (
              <table className="table">
                <tbody>
                  {state.conservationApplication.supportingDocuments.map((file, index) => (
                    <tr key={`${file.fileName}-${index}`}>
                      <td className="col-4 text-nowrap align-content-center px-2 py-3">
                        <Icon path={mdiFileDocument} size="1.5em" className="text-primary me-3" />
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

        {state.conservationApplication.supportingDocuments.length === 0 && <hr className="m-0" />}

        {isApplicationSubmitEnabled && (
          <div className="d-flex justify-content-end p-3">
            <Button variant="success" type="button" onClick={props.submitApplication}>
              Submit
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default ApplicationReviewForm;

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
