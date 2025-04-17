import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import {
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
} from '../../../data-contracts/CompensationRateUnits';
import { formatDateString, formatNumber } from '../../../utilities/valueFormatters';
import ApplicationFormSection from './ApplicationFormSection';
import FormElementDisplay from './FormElementDisplay';

const responsiveOneQuarterWidthDefault = 'col-lg-3 col-md-4 col-sm-6 col-12';
const responsiveOneThirdWidthDefault = 'col-lg-4 col-md-6 col-sm-6 col-12';
const responsiveHalfWidthDefault = 'col-lg-6 col-12';

// readonly / display-only version of the `ApplicationSubmissionForm` component
function ApplicationSubmissionFormDisplay() {
  const { state } = useConservationApplicationContext();
  const stateForm = state.conservationApplication.applicationSubmissionForm;
  const polygonData = state.conservationApplication.estimateLocations;

  return (
    <main>
      <div>
        <ApplicationFormSection title="Applicant Information" loadingFieldCount={7}>
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Landowner Name" displayValue={stateForm.landownerName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Email Address" displayValue={stateForm.landownerEmail} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Phone" displayValue={stateForm.landownerPhoneNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Address" displayValue={stateForm.landownerAddress} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="City" displayValue={stateForm.landownerCity} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="State" displayValue={stateForm.landownerState} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Zip Code" displayValue={stateForm.landownerZipCode} />
          </div>
        </ApplicationFormSection>

        <ApplicationFormSectionRule width={2} />

        <ApplicationFormSection title="Representative / Agent Contact Information" loadingFieldCount={3}>
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Name / Organization" displayValue={stateForm.agentName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Email" displayValue={stateForm.agentEmail} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Phone" displayValue={stateForm.agentPhoneNumber} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay label="Additional Details" displayValue={stateForm.agentAdditionalDetails} />
          </div>
        </ApplicationFormSection>

        <ApplicationFormSectionRule width={2} />

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
                  <FormElementDisplay label="Additional Details" displayValue={field.additionalDetails} />
                </div>
              </div>
            ))}
          </ApplicationFormSection>

          <div className="col-lg-6 col-12">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        <ApplicationFormSectionRule width={2} />

        <ApplicationFormSection title="Canal Company / Irrigation District" loadingFieldCount={3}>
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElementDisplay label="Name / Organization" displayValue={stateForm.canalOrIrrigationEntityName} />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElementDisplay label="Email" displayValue={stateForm.canalOrIrrigationEntityEmail} />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElementDisplay label="Phone" displayValue={stateForm.canalOrIrrigationEntityPhoneNumber} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Additional Details"
              displayValue={stateForm.canalOrIrrigationAdditionalDetails}
            />
          </div>
        </ApplicationFormSection>

        <ApplicationFormSectionRule width={2} />

        <ApplicationFormSection title="Water Right Information" loadingFieldCount={7}>
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Permit #" displayValue={stateForm.permitNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Facility (Ditch) Name" displayValue={stateForm.facilityDitchName} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Priority Date"
              displayValue={stateForm.priorityDate ? formatDateString(stateForm.priorityDate, 'MM/DD/YYYY') : undefined}
            />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Certificate #" displayValue={stateForm.certificateNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="Share #" displayValue={stateForm.shareNumber} />
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <FormElementDisplay label="State" displayValue={stateForm.waterRightState} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay label="Description of Water Use" displayValue={stateForm.waterUseDescription} />
          </div>
        </ApplicationFormSection>

        <ApplicationFormSectionRule width={2} />

        <ApplicationFormSection title="Estimation Summary" loadingFieldCount={5}>
          <div className="row">
            <div className="col-sm-6 col-md-3 mb-4">
              <FormElementDisplay
                label="Irrigated Field Area"
                displayValue={formatNumber(state.conservationApplication.polygonAcreageSum, 2) + ' Acres'}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElementDisplay
                label="Consumptive Use"
                displayValue={formatNumber(state.conservationApplication.cumulativeTotalEtInAcreFeet, 2) + ' Acre-Feet'}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElementDisplay
                label="Compensation Rate"
                displayValue={`$${state.conservationApplication.desiredCompensationDollars}/${CompensationRateUnitsLabelsSingular[state.conservationApplication.desiredCompensationUnits!]}`}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElementDisplay
                label="Requested Total ($)"
                displayValue={'$' + formatNumber(state.conservationApplication.conservationPayment, 0)}
              />
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Supplementary Review Information"
              displayValue={stateForm.estimationSupplementaryDetails}
            />
          </div>
        </ApplicationFormSection>

        <ApplicationFormSectionRule width={2} />

        <ApplicationFormSection title="Conservation Plan" loadingFieldCount={2}>
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Funding Request $ Amount"
              displayValue={'$' + stateForm.conservationPlanFundingRequestDollarAmount}
            />
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Units"
              displayValue={
                CompensationRateUnitsLabelsPlural[stateForm.conservationPlanFundingRequestCompensationRateUnits!]
              }
            />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay label="Conservation Description" displayValue={stateForm.conservationPlanDescription} />
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <FormElementDisplay
              label="Additional Information"
              displayValue={stateForm.conservationPlanAdditionalInfo}
            />
          </div>
        </ApplicationFormSection>
      </div>
    </main>
  );
}

export default ApplicationSubmissionFormDisplay;
