import { useNavigate } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import Form from 'react-bootstrap/esm/Form';
import { formatNumber } from '../../../utilities/valueFormatters';
import {
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
} from '../../../data-contracts/CompensationRateUnits';
import Button from 'react-bootstrap/esm/Button';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { Point } from 'geojson';
import { useMemo } from 'react';
import { convertWktToGeometry } from '../../../utilities/geometryWktConverter';
import center from '@turf/center';
import truncate from '@turf/truncate';

interface FieldData {
  fieldName: string;
  acreage: number;
  centerPoint: Point;
  polygonWkt: string;
  additionalDetails: string | undefined;
}

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
        backButtonText="Back to Estimator"
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

  const userDrawnFields: FieldData[] = useMemo(() => {
    return state.conservationApplication.selectedMapPolygons.map((polygon): FieldData => {
      const polygonEtData = state.conservationApplication.polygonEtData.find(
        (etData) => etData.polygonWkt === polygon.polygonWkt,
      )!;

      const centerPoint = truncate(center(convertWktToGeometry(polygon.polygonWkt))).geometry;

      const additionalDetails = state.conservationApplication.applicationSubmissionForm.fieldDetails.find(
        (fieldData) => fieldData.polygonWkt === polygon.polygonWkt,
      )?.additionalDetails;

      return {
        acreage: polygon.acreage,
        fieldName: polygonEtData.fieldName,
        polygonWkt: polygon.polygonWkt,
        centerPoint,
        additionalDetails,
      };
    });
  }, [state.conservationApplication.selectedMapPolygons, state.conservationApplication.polygonEtData]);

  const submitApplication = () => {
    alert('not implemented.');
  };

  // assumes all polygons are not intersecting
  const acreageSum = state.conservationApplication.selectedMapPolygons.reduce(
    (sum, polygon) => sum + polygon.acreage,
    0,
  );
  const etAcreFeet = state.conservationApplication.polygonEtData.reduce(
    (sum, polygon) => sum + polygon.averageYearlyEtInAcreFeet,
    0,
  );

  // not combined with the section component because of the one-off case of the "Property & Land Area Information" section
  const sectionRule = <hr className="text-primary" style={{ borderWidth: 2 }} />;

  const displayValueOrFallback = (value: any) => <>{value || 'No input provided.'}</>;

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
        <FormSection title="Applicant Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Landowner Name</span>
            </div>
            <div>
              <span>{stateForm.landownerName}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Email Address</span>
            </div>
            <div>
              <span>{stateForm.landownerEmail}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Phone</span>
            </div>
            <div>
              <span>{stateForm.landownerPhoneNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Address</span>
            </div>
            <div>
              <span>{stateForm.landownerAddress}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">City</span>
            </div>
            <div>
              <span>{stateForm.landownerCity}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">State</span>
            </div>
            <div>
              <span>{stateForm.landownerState}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Zip Code</span>
            </div>
            <div>
              <span>{stateForm.landownerZipCode}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <FormSection title="Representative / Agent Contact Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Name / Organization</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.agentName)}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Email</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.agentEmail)}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Phone</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.agentPhoneNumber)}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Additional Details</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.agentAdditionalDetails)}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <div className="row">
          <FormSection title="Property & Land Area Information" className="col-lg-6 col-12">
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
                  <div>
                    <span className="text-muted">Additional Details</span>
                  </div>
                  <div>
                    <span>{displayValueOrFallback(field.additionalDetails)}</span>
                  </div>
                </div>
              </div>
            ))}
          </FormSection>

          <div className="col-lg-6 col-12">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        {sectionRule}

        <FormSection title="Canal Company / Irrigation District">
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Name / Organization</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.canalOrIrrigationEntityName)}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Email</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.canalOrIrrigationEntityEmail)}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Phone</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.canalOrIrrigationEntityPhoneNumber)}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Additional Details</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.canalOrIrrigationAdditionalDetails)}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <FormSection title="Water Right Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Permit #</span>
            </div>
            <div>
              <span>{stateForm.permitNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Facility (Ditch) Name</span>
            </div>
            <div>
              <span>{stateForm.facilityDitchName}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Priority Date</span>
            </div>
            <div>
              <span>{stateForm.priorityDate}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Certificate #</span>
            </div>
            <div>
              <span>{stateForm.certificateNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Share #</span>
            </div>
            <div>
              <span>{stateForm.shareNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">State</span>
            </div>
            <div>
              <span>{stateForm.waterRightState}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Description of Water Use</span>
            </div>
            <div>
              <span>{stateForm.waterUseDescription}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <FormSection title="Estimation Summary">
          <div className="row">
            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="text-muted">Irrigated Field Area</span>
              </div>
              <div>
                <span>{formatNumber(acreageSum, 2)} Acres</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="text-muted">Consumptive Use</span>
              </div>
              <div>
                <span>{formatNumber(etAcreFeet, 2)} Acre-Feet</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="text-muted">Compensation Rate</span>
              </div>
              <div>
                <span>
                  ${state.conservationApplication.desiredCompensationDollars}/
                  {CompensationRateUnitsLabelsSingular[state.conservationApplication.desiredCompensationUnits!]}
                </span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="text-muted">Requested Total ($)</span>
              </div>
              <div>
                <span>${formatNumber(state.conservationApplication.conservationPayment, 0)}</span>
              </div>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Supplementary Review Information</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.estimationSupplementaryDetails)}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <FormSection title="Conservation Plan">
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Funding Request $ Amount</span>
            </div>
            <div>
              <span>${stateForm.conservationPlanFundingRequestDollarAmount}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Units</span>
            </div>
            <div>
              <span>
                {CompensationRateUnitsLabelsPlural[stateForm.conservationPlanFundingRequestCompensationRateUnits!]}
              </span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Conservation Description</span>
            </div>
            <div>
              <span>{stateForm.conservationPlanDescription}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span className="text-muted">Additional Information</span>
            </div>
            <div>
              <span>{displayValueOrFallback(stateForm.conservationPlanAdditionalInfo)}</span>
            </div>
          </div>
        </FormSection>

        {sectionRule}

        <FormSection title="Supporting Documents (Optional)">
          <div className="col mb-4">
            <span>todo</span>
          </div>
        </FormSection>

        <hr className="m-0" />
        <div className="d-flex justify-content-end p-3">
          <Button variant="success">Submit</Button>
        </div>
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode | undefined;
}

function FormSection(props: FormSectionProps) {
  return (
    <div className={props.className}>
      <div className="mb-4">
        <div>
          <span className="fs-5">{props.title}</span>
        </div>

        {props.subtitle && (
          <div>
            <span className="text-muted">{props.subtitle}</span>
          </div>
        )}
      </div>

      <div className="row">{props.children}</div>
    </div>
  );
}
