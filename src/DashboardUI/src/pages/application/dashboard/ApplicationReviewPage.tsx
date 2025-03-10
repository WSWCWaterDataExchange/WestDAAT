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

  return (
    <div className="container">
      <div className="mb-3">
        <span className="fs-4 fw-bold">New Application</span>
      </div>

      <div className="d-flex gap-3 mb-4">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div className="mb-4">
        <span>
          Complete the below fields in order to submit your application to your state agency for verification. Be sure
          everything is filled out accurately and truthfully.
        </span>
      </div>

      <div>
        <FormSection title="Applicant Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Landowner Name</span>
            </div>
            <div>
              <span>{stateForm.landownerName}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Email Address</span>
            </div>
            <div>
              <span>{stateForm.landownerEmail}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Phone</span>
            </div>
            <div>
              <span>{stateForm.landownerPhoneNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Address</span>
            </div>
            <div>
              <span>{stateForm.landownerAddress}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>City</span>
            </div>
            <div>
              <span>{stateForm.landownerCity}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>State</span>
            </div>
            <div>
              <span>{stateForm.landownerState}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Zip Code</span>
            </div>
            <div>
              <span>{stateForm.landownerZipCode}</span>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Representative / Agent Contact Information"
          subtitle="Is this application being submitted by a representative of the water right’s holder? If yes, please provide the representative’s contact information."
        >
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Name / Organization</span>
            </div>
            <div>
              <span>{stateForm.agentName}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Email</span>
            </div>
            <div>
              <span>{stateForm.agentEmail}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Phone</span>
            </div>
            <div>
              <span>{stateForm.agentPhoneNumber}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>Additional Details</span>
            </div>
            <div>
              <span>{stateForm.agentAdditionalDetails}</span>
            </div>
          </div>
        </FormSection>

        <div className="row">
          <FormSection title="Property & Land Area Information" className="col-lg-6 col-12">
            <span>todo</span>
            {/* {userDrawnFields.map((field, index) => (
              <div className="row mb-4" key={field.fieldName}>
                <div className="col-3">
                  <span>{field.fieldName}</span>
                </div>
                <div className="col-3">
                  <span className="fw-bold">Acres: </span>
                  <span>{formatNumber(field.acreage, 2)}</span>
                </div>
                <div className="col-6">
                  <span className="fw-bold">Location: </span>
                  <span>
                    ({field.centerPoint.coordinates[1]}, {field.centerPoint.coordinates[0]})
                  </span>
                </div>
                <div className={`col-12 mb-4`}>
                  <div><span>Additional Details</span></div>
                  <Form.Control


                    value={stateForm.fieldDetails[index]?.additionalDetails ?? ''}
                  />
                </div>
              </div>
            ))} */}
          </FormSection>

          <div className="col-lg-6 col-12">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        <FormSection
          title="Canal Company / Irrigation District"
          subtitle="Is your water right part of a canal company or irrigation district? If yes, please provide their contact
              information."
        >
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span>Name / Organization</span>
            </div>
            <div>
              <span>{stateForm.canalOrIrrigationEntityName}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span>Email</span>
            </div>
            <div>
              <span>{stateForm.canalOrIrrigationEntityEmail}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span>Phone</span>
            </div>
            <div>
              <span>{stateForm.canalOrIrrigationEntityPhoneNumber}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>Additional Details</span>
            </div>
            <div>
              <span>{stateForm.canalOrIrrigationAdditionalDetails}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Water Right Information">
          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Permit #</span>
            </div>
            <div>
              <span>{stateForm.permitNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Facility (Ditch) Name</span>
            </div>
            <div>
              <span>{stateForm.facilityDitchName}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Priority Date</span>
            </div>
            <div>
              <span>{stateForm.priorityDate}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Certificate #</span>
            </div>
            <div>
              <span>{stateForm.certificateNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>Share #</span>
            </div>
            <div>
              <span>{stateForm.shareNumber}</span>
            </div>
          </div>

          <div className={`${responsiveOneQuarterWidthDefault} mb-4`}>
            <div>
              <span>State</span>
            </div>
            <div>
              <span>{stateForm.waterRightState}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>Description of Water Use</span>
            </div>
            <div>
              <span>{stateForm.waterUseDescription}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Estimation Summary">
          <div className="row">
            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="fw-bold">Irrigated Field Area</span>
              </div>
              <div>
                <span>{formatNumber(acreageSum, 2)} Acres</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="fw-bold">Consumptive Use</span>
              </div>
              <div>
                <span>{formatNumber(etAcreFeet, 2)} Acre-Feet</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3 mb-4">
              <div>
                <span className="fw-bold">Compensation Rate</span>
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
                <span className="fw-bold">Requested Total ($)</span>
              </div>
              <div>
                <span>${formatNumber(state.conservationApplication.conservationPayment, 0)}</span>
              </div>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>
                Do you have supplementary data that can help in reviewing this estimate? If so, provide that here.
              </span>
            </div>
            <div>
              <span>{stateForm.estimationSupplementaryDetails}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Conservation Plan">
          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span>Funding Request $ Amount</span>
            </div>
            <div>
              <span>${stateForm.conservationPlanFundingRequestDollarAmount}</span>
            </div>
          </div>

          <div className={`${responsiveOneThirdWidthDefault} mb-4`}>
            <div>
              <span>Units</span>
            </div>
            <div>
              <span>
                {CompensationRateUnitsLabelsPlural[stateForm.conservationPlanFundingRequestCompensationRateUnits!]}
              </span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>Describe your Conservation Plan.</span>
            </div>
            <div>
              <span>{stateForm.conservationPlanDescription}</span>
            </div>
          </div>

          <div className={`${responsiveHalfWidthDefault} mb-4`}>
            <div>
              <span>Additional Information</span>
            </div>
            <div>
              <span>{stateForm.conservationPlanAdditionalInfo}</span>
            </div>
          </div>
        </FormSection>

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
