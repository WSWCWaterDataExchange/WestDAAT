import { createRef, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { useNavigate } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { states } from '../../../config/states';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationSubmissionFormData } from '../../../data-contracts/ApplicationSubmissionFormData';
import {
  CompensationRateUnits,
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
  CompensationRateUnitsOptions,
} from '../../../data-contracts/CompensationRateUnits';
import { formatNumber } from '../../../utilities/valueFormatters';
import ApplicationFormSection from './ApplicationFormSection';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

const responsiveOneQuarterWidthDefault = 'col-lg-3 col-md-4 col-sm-6 col-12';
const responsiveOneThirdWidthDefault = 'col-lg-4 col-md-6 col-12';
const responsiveHalfWidthDefault = 'col-lg-6 col-12';

interface ApplicationSubmissionFormProps {
  perspective: ApplicationReviewPerspective;
  ref: React.Ref<HTMLFormElement>;
  formValidated: boolean;
}

function ApplicationSubmissionForm(props: ApplicationSubmissionFormProps) {
  const { perspective, ref, formValidated } = props;

  const { state, dispatch } = useConservationApplicationContext();
  const stateForm = state.conservationApplication.applicationSubmissionForm;
  const polygonData = state.conservationApplication.estimateLocations;

  const navigate = useNavigate();
  const navigateToReviewPageMap = () => {
    navigate('map');
  };

  const landownerNameRef = useRef<HTMLInputElement>(null);
  const landownerEmailRef = useRef<HTMLInputElement>(null);
  const landownerPhoneNumberRef = useRef<HTMLInputElement>(null);
  const landownerAddressRef = useRef<HTMLInputElement>(null);
  const landownerCityRef = useRef<HTMLInputElement>(null);
  const landownerStateRef = useRef<HTMLSelectElement>(null);
  const landownerZipCodeRef = useRef<HTMLInputElement>(null);
  const agentNameRef = useRef<HTMLInputElement>(null);
  const agentEmailRef = useRef<HTMLInputElement>(null);
  const agentPhoneNumberRef = useRef<HTMLInputElement>(null);
  const agentAdditionalDetailsRef = useRef<HTMLTextAreaElement>(null);
  const propertyAdditionalDetailsRef = useRef(polygonData.map(() => createRef()));
  const canalOrIrrigationEntityNameRef = useRef<HTMLInputElement>(null);
  const canalOrIrrigationEntityEmailRef = useRef<HTMLInputElement>(null);
  const canalOrIrrigationEntityPhoneNumberRef = useRef<HTMLInputElement>(null);
  const canalOrIrrigationAdditionalDetailsRef = useRef<HTMLTextAreaElement>(null);
  const permitNumberRef = useRef<HTMLInputElement>(null);
  const facilityDitchNameRef = useRef<HTMLInputElement>(null);
  const priorityDateRef = useRef<HTMLInputElement>(null);
  const certificateNumberRef = useRef<HTMLInputElement>(null);
  const shareNumberRef = useRef<HTMLInputElement>(null);
  const waterRightStateRef = useRef<HTMLSelectElement>(null);
  const waterUseDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const estimationSupplementaryDetailsRef = useRef<HTMLTextAreaElement>(null);
  const conservationPlanFundingRequestDollarAmountRef = useRef<HTMLInputElement>(null);
  const conservationPlanFundingRequestCompensationRateUnitsRef = useRef<HTMLSelectElement>(null);
  const conservationPlanDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const conservationPlanAdditionalInfoRef = useRef<HTMLTextAreaElement>(null);

  const onFormChanged = () => {
    const conservationPlanFundingRequestDollarAmount = conservationPlanFundingRequestDollarAmountRef.current?.value
      ? Number(conservationPlanFundingRequestDollarAmountRef.current?.value)
      : undefined;

    const cpfrcruValueAsEnum = Number(
      conservationPlanFundingRequestCompensationRateUnitsRef.current?.value,
    ) as CompensationRateUnits;
    const conservationPlanFundingRequestCompensationUnits:
      | Exclude<CompensationRateUnits, CompensationRateUnits.None>
      | undefined = cpfrcruValueAsEnum === CompensationRateUnits.None ? undefined : cpfrcruValueAsEnum;

    const formValues: ApplicationSubmissionFormData = {
      landownerName: landownerNameRef.current?.value,
      landownerEmail: landownerEmailRef.current?.value,
      landownerPhoneNumber: landownerPhoneNumberRef.current?.value,
      landownerAddress: landownerAddressRef.current?.value,
      landownerCity: landownerCityRef.current?.value,
      landownerState: landownerStateRef.current?.value,
      landownerZipCode: landownerZipCodeRef.current?.value,
      agentName: agentNameRef.current?.value,
      agentEmail: agentEmailRef.current?.value,
      agentPhoneNumber: agentPhoneNumberRef.current?.value,
      agentAdditionalDetails: agentAdditionalDetailsRef.current?.value,
      fieldDetails: polygonData.map((field, index) => ({
        waterConservationApplicationEstimateLocationId: field.waterConservationApplicationEstimateLocationId!,
        additionalDetails: (propertyAdditionalDetailsRef.current[index].current as any).value,
      })),
      canalOrIrrigationEntityName: canalOrIrrigationEntityNameRef.current?.value,
      canalOrIrrigationEntityEmail: canalOrIrrigationEntityEmailRef.current?.value,
      canalOrIrrigationEntityPhoneNumber: canalOrIrrigationEntityPhoneNumberRef.current?.value,
      canalOrIrrigationAdditionalDetails: canalOrIrrigationAdditionalDetailsRef.current?.value,
      permitNumber: permitNumberRef.current?.value,
      facilityDitchName: facilityDitchNameRef.current?.value,
      priorityDate: priorityDateRef.current?.value,
      certificateNumber: certificateNumberRef.current?.value,
      shareNumber: shareNumberRef.current?.value,
      waterRightState: waterRightStateRef.current?.value,
      waterUseDescription: waterUseDescriptionRef.current?.value,
      estimationSupplementaryDetails: estimationSupplementaryDetailsRef.current?.value,
      conservationPlanFundingRequestDollarAmount: conservationPlanFundingRequestDollarAmount,
      conservationPlanFundingRequestCompensationRateUnits: conservationPlanFundingRequestCompensationUnits,
      conservationPlanDescription: conservationPlanDescriptionRef.current?.value,
      conservationPlanAdditionalInfo: conservationPlanAdditionalInfoRef.current?.value,
    };

    dispatch({
      type: 'APPLICATION_SUBMISSION_FORM_UPDATED',
      payload: {
        formValues,
      },
    });
  };

  return (
    <Form ref={ref} onChange={onFormChanged} validated={formValidated} noValidate>
      <ApplicationFormSection title="Applicant Information">
        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerName">
          <Form.Label>Landowner Name</Form.Label>
          <Form.Control
            type="text"
            maxLength={100}
            required
            ref={landownerNameRef}
            defaultValue={stateForm.landownerName}
          />
          <Form.Control.Feedback type="invalid">Landowner Name is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            maxLength={255}
            required
            ref={landownerEmailRef}
            defaultValue={stateForm.landownerEmail}
          />
          <Form.Control.Feedback type="invalid">Email Address is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerPhoneNumber">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            maxLength={50}
            required
            ref={landownerPhoneNumberRef}
            defaultValue={stateForm.landownerPhoneNumber}
          />
          <Form.Control.Feedback type="invalid">Phone is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            required
            ref={landownerAddressRef}
            defaultValue={stateForm.landownerAddress}
          />
          <Form.Control.Feedback type="invalid">Address is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            maxLength={100}
            required
            ref={landownerCityRef}
            defaultValue={stateForm.landownerCity}
          />
          <Form.Control.Feedback type="invalid">City is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerState">
          <Form.Label>State</Form.Label>
          <Form.Select required ref={landownerStateRef} defaultValue={stateForm.landownerState}>
            <option value={''}>Select a state</option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="landownerZipCode">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            maxLength={10}
            required
            ref={landownerZipCodeRef}
            defaultValue={stateForm.landownerZipCode}
          />
          <Form.Control.Feedback type="invalid">Zip Code is required.</Form.Control.Feedback>
        </Form.Group>
      </ApplicationFormSection>

      <ApplicationFormSection
        title="Representative / Agent Contact Information"
        subtitle="Is this application being submitted by a representative of the water right’s holder? If yes, please provide the representative’s contact information."
      >
        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="agentName">
          <Form.Label>Name / Organization</Form.Label>
          <Form.Control type="text" maxLength={100} ref={agentNameRef} defaultValue={stateForm.agentName} />
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="agentEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" maxLength={255} ref={agentEmailRef} defaultValue={stateForm.agentEmail} />
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="agentPhoneNumber">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" maxLength={50} ref={agentPhoneNumberRef} defaultValue={stateForm.agentPhoneNumber} />
        </Form.Group>

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="agentAdditionalDetails">
          <Form.Label>Additional Details</Form.Label>
          <Form.Control
            as="textarea"
            maxLength={4000}
            ref={agentAdditionalDetailsRef}
            defaultValue={stateForm.agentAdditionalDetails}
          />
        </Form.Group>
      </ApplicationFormSection>

      <div className="row">
        <ApplicationFormSection title="Property & Land Area Information" className="col-lg-6 col-12">
          {polygonData.map((field, index) => (
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
                  ({field.centerPoint!.coordinates[1]}, {field.centerPoint!.coordinates[0]})
                </span>
              </div>
              <Form.Group className={`col-12 mb-4`} controlId={`propertyAdditionalDetails-${index}`}>
                <Form.Label>Additional Details</Form.Label>
                <Form.Control
                  as="textarea"
                  maxLength={4000}
                  required
                  ref={propertyAdditionalDetailsRef.current[index] as any}
                  defaultValue={stateForm.fieldDetails[index]?.additionalDetails ?? ''}
                />
                <Form.Control.Feedback type="invalid">Additional Details is required.</Form.Control.Feedback>
              </Form.Group>
            </div>
          ))}
        </ApplicationFormSection>

        <div className="col-lg-6 col-12">
          Static map here
          <NotImplementedPlaceholder />
          {perspective === 'reviewer' && (
            <Button variant="outline-primary" onClick={navigateToReviewPageMap}>
              Edit in Estimator
            </Button>
          )}
        </div>
      </div>

      <ApplicationFormSection
        title="Canal Company / Irrigation District"
        subtitle="Is your water right part of a canal company or irrigation district? If yes, please provide their contact
              information."
      >
        <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="canalOrIrrigationEntityName">
          <Form.Label>Name / Organization</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            ref={canalOrIrrigationEntityNameRef}
            defaultValue={stateForm.canalOrIrrigationEntityName}
          />
        </Form.Group>

        <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="canalOrIrrigationEntityEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            maxLength={255}
            ref={canalOrIrrigationEntityEmailRef}
            defaultValue={stateForm.canalOrIrrigationEntityEmail}
          />
        </Form.Group>

        <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="canalOrIrrigationEntityPhoneNumber">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            maxLength={50}
            ref={canalOrIrrigationEntityPhoneNumberRef}
            defaultValue={stateForm.canalOrIrrigationEntityPhoneNumber}
          />
        </Form.Group>

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="canalOrIrrigationAdditionalDetails">
          <Form.Label>Additional Details</Form.Label>
          <Form.Control
            as="textarea"
            maxLength={4000}
            ref={canalOrIrrigationAdditionalDetailsRef}
            defaultValue={stateForm.canalOrIrrigationAdditionalDetails}
          />
        </Form.Group>
      </ApplicationFormSection>

      <ApplicationFormSection title="Water Right Information">
        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="permitNumber">
          <Form.Label>Permit #</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            required
            ref={permitNumberRef}
            defaultValue={stateForm.permitNumber}
          />
          <Form.Control.Feedback type="invalid">Permit # is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="facilityDitchName">
          <Form.Label>Facility (Ditch) Name</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            required
            ref={facilityDitchNameRef}
            defaultValue={stateForm.facilityDitchName}
          />
          <Form.Control.Feedback type="invalid">Facility (Ditch) Name is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="priorityDate">
          <Form.Label>Priority Date</Form.Label>
          <Form.Control
            type="date"
            required
            ref={priorityDateRef}
            defaultValue={stateForm.priorityDate}
            // not sure on the actual min date, but this prevents users from entering the default value "0001-01-01"
            min="1900-01-01"
          />
          <Form.Control.Feedback type="invalid">Priority Date is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="certificateNumber">
          <Form.Label>Certificate #</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            required
            ref={certificateNumberRef}
            defaultValue={stateForm.certificateNumber}
          />
          <Form.Control.Feedback type="invalid">Certificate # is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="shareNumber">
          <Form.Label>Share #</Form.Label>
          <Form.Control
            type="text"
            maxLength={255}
            required
            ref={shareNumberRef}
            defaultValue={stateForm.shareNumber}
          />
          <Form.Control.Feedback type="invalid">Share # is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveOneQuarterWidthDefault} mb-4`} controlId="waterRightState">
          <Form.Label>State</Form.Label>
          <Form.Select required ref={waterRightStateRef} defaultValue={stateForm.waterRightState}>
            <option value={''}>Select a state</option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="waterUseDescription">
          <Form.Label>Description of Water Use</Form.Label>
          <Form.Control
            as="textarea"
            maxLength={4000}
            required
            ref={waterUseDescriptionRef}
            defaultValue={stateForm.waterUseDescription}
          />
          <Form.Control.Feedback type="invalid">Description of Water Use is required.</Form.Control.Feedback>
        </Form.Group>
      </ApplicationFormSection>

      <ApplicationFormSection title="Estimation Summary">
        <div className="row">
          <div className="col-sm-6 col-md-3 mb-4">
            <div>
              <span className="fw-bold">Irrigated Field Area</span>
            </div>
            <div>
              <span>{formatNumber(state.conservationApplication.polygonAcreageSum, 2)} Acres</span>
            </div>
          </div>

          <div className="col-sm-6 col-md-3 mb-4">
            <div>
              <span className="fw-bold">Consumptive Use</span>
            </div>
            <div>
              <span>{formatNumber(state.conservationApplication.totalAverageYearlyEtAcreFeet, 2)} Acre-Feet</span>
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

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="estimationSupplementaryDetails">
          <Form.Label>
            Do you have supplementary data that can help in reviewing this estimate? If so, provide that here.
          </Form.Label>
          <Form.Control
            as="textarea"
            maxLength={4000}
            type="text"
            ref={estimationSupplementaryDetailsRef}
            defaultValue={stateForm.estimationSupplementaryDetails}
          />
        </Form.Group>
      </ApplicationFormSection>

      <ApplicationFormSection title="Conservation Plan">
        <Form.Group
          className={`${responsiveOneThirdWidthDefault} mb-4`}
          controlId="conservationPlanFundingRequestDollarAmount"
        >
          <Form.Label>Funding Request $ Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              required
              min={1}
              ref={conservationPlanFundingRequestDollarAmountRef}
              defaultValue={stateForm.conservationPlanFundingRequestDollarAmount}
            />
          </InputGroup>

          <Form.Control.Feedback type="invalid">Funding Request $ Amount is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          className={`${responsiveOneThirdWidthDefault} mb-4`}
          controlId="conservationPlanFundingRequestCompensationRateUnits"
        >
          <Form.Label>Units</Form.Label>
          <Form.Select
            required
            ref={conservationPlanFundingRequestCompensationRateUnitsRef}
            defaultValue={stateForm.conservationPlanFundingRequestCompensationRateUnits}
          >
            <option value={''}>Select an option</option>
            {CompensationRateUnitsOptions.map((value) => (
              <option key={value} value={value}>
                {CompensationRateUnitsLabelsPlural[value]}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">Units is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="conservationPlanDescription">
          <Form.Label>Describe your Conservation Plan.</Form.Label>
          <Form.Control
            as="textarea"
            required
            ref={conservationPlanDescriptionRef}
            defaultValue={stateForm.conservationPlanDescription}
          />
          <Form.Control.Feedback type="invalid">Conservation Plan is required.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={`${responsiveHalfWidthDefault} mb-4`} controlId="conservationPlanAdditionalInfo">
          <Form.Label>Additional Information</Form.Label>
          <Form.Control
            as="textarea"
            ref={conservationPlanAdditionalInfoRef}
            defaultValue={stateForm.conservationPlanAdditionalInfo}
          />
        </Form.Group>
      </ApplicationFormSection>
    </Form>
  );
}

export default ApplicationSubmissionForm;
