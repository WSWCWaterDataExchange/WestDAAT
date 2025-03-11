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
import { useMemo } from 'react';
import ApplicationFormSection from '../components/ApplicationFormSection';
import { CombinedPolygonData } from '../../../data-contracts/CombinedPolygonData';

export function ApplicationReviewPage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const navigateToApplicationCreatePage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/create`);
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationCreatePage}
        backButtonText="Back to Application"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <ApplicationReviewPageLayout />
      </div>
    </div>
  );
}

const responsiveOneQuarterWidthDefault = 'col-lg-3 col-md-4 col-12';
const responsiveOneThirdWidthDefault = 'col-lg-4 col-md-6 col-12';
const responsiveHalfWidthDefault = 'col-lg-6 col-12';

function ApplicationReviewPageLayout() {
  const { state } = useConservationApplicationContext();
  const stateForm = state.conservationApplication.applicationSubmissionForm;
  const polygonData = state.conservationApplication.combinedPolygonData;

  const userDrawnFields: (CombinedPolygonData & { additionalDetails: string })[] = useMemo(() => {
    return polygonData.map((polygon): CombinedPolygonData & { additionalDetails: string } => {
      const additionalDetails =
        state.conservationApplication.applicationSubmissionForm.fieldDetails.find(
          (fieldData) => fieldData.polygonWkt === polygon.polygonWkt,
        )?.additionalDetails ?? '';

      return {
        ...polygon,
        additionalDetails,
      };
    });
  }, [polygonData]);

  const submitApplication = () => {
    alert('not implemented.');
  };

  // assumes all polygons are not intersecting
  const acreageSum = polygonData.reduce((sum, polygon) => sum + polygon.acreage, 0);
  const etAcreFeet = polygonData.reduce((sum, polygon) => sum + polygon.averageYearlyEtInAcreFeet, 0);

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
            {userDrawnFields.map((field) => (
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
                    ({field.centerPoint.coordinates[1]}, {field.centerPoint.coordinates[0]})
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
              <FormElement label="Irrigated Field Area" displayValue={formatNumber(acreageSum, 2) + ' Acres'} />
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <FormElement label="Consumptive Use" displayValue={formatNumber(etAcreFeet, 2) + ' Acre-Feet'} />
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
          <NotImplementedPlaceholder />
        </ApplicationFormSection>

        <hr className="m-0" />
        <div className="d-flex justify-content-end p-3">
          <Button variant="success" type="button" onClick={submitApplication}>
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
