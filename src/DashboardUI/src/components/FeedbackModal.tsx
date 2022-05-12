import { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { FeedbackRequest } from '../data-contracts/FeedbackRequest';
import {toast} from 'react-toastify';
import { postFeedback } from '../accessors/systemAccessor';
import validator from 'validator';

interface FeedBackModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

const dataInsterestOptions: string[] = [
  "Discharge (Streamflow)",
  "Dissolved Oxygen",
  "Groundwater Level",
  "pH",
  "Precipitation",
  "River Level (Stage)",
  "Specific Conductance",
  "Turbidity",
  "Water Temperature"
]

const dashboardSatisfactionOptions: string[] = [
  "Very Satisfied",
  "Somewhat satisfied",
  "Neither satisfied nor dissatisfied",
  "Somewhat dissatisfied",
  "Very dissatisfied"
]

const dataUsageOptions: string[] = [
  "Agricultural Water Supply Management",
  "Forecasts/Warnings",
  "General Interest",
  "Long-Term Trends",
  "Navigation",
  "Public Water Supply Management",
  "Recreation",
  "Research",
  "Reservoir Management",
  "Thermoelectric/Hydropower",
  "Water Quality Permit Complicance",
  "Watershed Management"
]

function FeedbackModal(props: FeedBackModalProps) {

  const [dataUseSelected, setDataUseSelected] = useState<string[]>([]);
  const [dataInteresetSelected, setDataInterestSelected] = useState<string[]>([]);
  const [satisfactionLevelSelected, setSatisfactionLevelValue] = useState<string>("");
  const [otherDataInterestValue, setOtherDataInterestValue] = useState<string>("");
  const [otherDataUseValue, setOtherDataUseValue] = useState<string>("");
  const [commentsValue, setCommentsValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [nameValue, setNameValue] = useState<string>("");
  const [lastNameValue, setLastNameValue] = useState<string>("");
  const [organizationValue, setOrganizationValue] = useState<string>("");
  const [roleValue, setRoleValue] = useState<string>("");
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [showErrorLabel, setShowErrorLabel] = useState<boolean>(false);
  const [isEmailInvalid, setEmailError] = useState<boolean>()

  const handleCheck = (event: ChangeEvent<HTMLInputElement>, dataArray: string[]) => {
    var updatedList: string[] = [...dataArray];
    if (event.target.checked) {
      updatedList = [...dataArray, event.target.value];
    } else {
      updatedList.splice(dataArray.indexOf(event.target.value), 1);
    }

    return updatedList;
  };

  const close = () => {
    clearCollections();
    setShowErrorLabel(false);
    props.setShow(false);
    setShowThankYouModal(false);
  }

  const submit = async () => {
    const feedbackRequest = new FeedbackRequest();
    feedbackRequest.firstName = nameValue;
    feedbackRequest.lastName = lastNameValue;
    feedbackRequest.comments = commentsValue;
    feedbackRequest.email = emailValue;
    feedbackRequest.organization = organizationValue;
    feedbackRequest.role = roleValue;
    feedbackRequest.satisfactionLevel = satisfactionLevelSelected;

    if (otherDataUseValue !== null && otherDataUseValue !== "") {
      dataUseSelected.push(otherDataUseValue);
    }
    feedbackRequest.dataUsage = dataUseSelected;

    if (otherDataInterestValue !== null && otherDataInterestValue !== "") {
      dataInteresetSelected.push(otherDataInterestValue);
    }
    feedbackRequest.dataInterest = dataInteresetSelected;

    // check if feedback is empty before triggering a submit request
    if (validateRequestIsValid(feedbackRequest)) {
      setShowThankYouModal(true);
      props.setShow(false);
      clearCollections();
      const result = await postFeedback(feedbackRequest);
      if (result === false){
        toast.error("Something went wrong sending the feedback",
          {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored'
          })
        // do toast error message that something went wrong
      }
    } else {
      setShowErrorLabel(true);
    }
  }

  const validateRequestIsValid = (request: FeedbackRequest) => {
    return ((request.comments !== null && request.comments !== "")
    || ((!isEmailInvalid) && (request.email !== null && request.email !== ""))
    || (request.firstName !== null && request.firstName !== "")
    || (request.lastName !== null && request.lastName !== "")
    || (request.organization !== null && request.organization !== "")
    || (request.role !== null && request.role !== "")
    || (request.satisfactionLevel !== null && request.satisfactionLevel !== "")
    || (request.dataInterest?.length !== 0 && request.dataInterest?.every(interest => interest !== ""))
    || (request.dataUsage?.length !== 0 && request.dataUsage?.every(use => use !== "")))
  }

  const validateEmail = (email: string) => {
  setEmailValue(email);
    if (!validator.isEmail(email)) {
      setEmailError(true)
    }else{
      setEmailError(false);
    }
  }

  const clearCollections = () => {
    setEmailError(false);
    setShowErrorLabel(false);
    setNameValue("");
    setLastNameValue("");
    setCommentsValue("");
    setEmailValue("");
    setOrganizationValue("");
    setRoleValue("");
    setOtherDataUseValue("");
    setOtherDataInterestValue("");
    setSatisfactionLevelValue("");
    setDataInterestSelected([]);
    setDataUseSelected([]);
  }

  return (
    <>
      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title id="contained-modal-title-vcenter">
            Send Feedback
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please let us know your feedback about the Water Data Exchange Data (WaDE) Dashboard.
          </p>
          <div className="mb-3">
            <label className="form-label fw-bolder">First Name(Optional)</label>
            <input className="form-control" placeholder="John" onChange={(e) => setNameValue(e.target.value ?? "")} value={nameValue} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bolder">Last Name(Optional)</label>
            <input className="form-control" placeholder="Doe" onChange={(e) => setLastNameValue(e.target.value ?? "")} value={lastNameValue} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bolder">Email(Required)</label>
            <input type="email" className="form-control" placeholder="email@domain.com" onChange={(e) => validateEmail(e.target.value)} value={emailValue} />
            {isEmailInvalid && <label className="text-danger">Please use a valid email address</label>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-bolder">Comments(Optional)</label>
            <textarea className="form-control" onChange={(e) => setCommentsValue(e.target.value ?? "")} value={commentsValue} />
          </div>
          <div className="mb-3">
            <label className="fw-bolder">Professional Organization(Optional)</label> <br />
            <input className="form-control" onChange={(e) => setOrganizationValue(e.target.value ?? "")} value={organizationValue} />
          </div>
          <div className="mb-3">
            <label className="fw-bolder">Role(Optional)</label> <br />
            <input className="form-control" onChange={(e) => setRoleValue(e.target.value ?? "")} value={roleValue} />
          </div>
          <div className="mb-3">
            <label className="fw-bolder">How do you use the data?(Optional)</label>
            {dataUsageOptions.map(element =>
              <div className="form-check" key={element}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={element}
                  onChange={(e) => setDataUseSelected(handleCheck(e, dataUseSelected))}
                />
                <label className="form-check-label" htmlFor={element}>
                  {element}
                </label>
              </div>
            )}
            <div className="mt-2">
              <label className="form-label">Other(Optional)</label>
              <input type="text" className="form-control" onChange={(e) => setOtherDataUseValue(e.target.value ?? "")} value={otherDataUseValue} />
            </div>
          </div>
          <div className="mb-3">
            <label className="fw-bolder">Select which data interests you the most?(Optional)</label>
            {dataInsterestOptions.map(element =>
              <div className="form-check" key={element}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={element}
                  onChange={(e) => setDataInterestSelected(handleCheck(e, dataInteresetSelected))}
                />
                <label className="form-check-label" htmlFor={element}>
                  {element}
                </label>
              </div>
            )}
            <div className="mt-2">
              <label className="form-label">Other(Optional)</label>
              <input type="text" className="form-control" onChange={(e) => setOtherDataInterestValue(e.target.value ?? "")} value={otherDataInterestValue} />
            </div>
          </div>
          <div className="mb-3" id="dashboardSatisfactionLevel">
            <label className="fw-bolder">How satisfied are you with the Water Data Exchange Data(WaDE) Dashboard?(Optional)</label>
            {dashboardSatisfactionOptions.map(element =>
              <div className="form-check" key={element}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="dashboardSatisfaction"
                  value={element}
                  onChange={(e) => setSatisfactionLevelValue(e.target.value ?? "")}
                />
                <label className="form-check-label" htmlFor={element}>
                  {element}
                </label>
              </div>
            )}
            <div className="mt-3">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {showErrorLabel && <label className="text-danger">Please fill at least one field before submitting</label>}
          <Button onClick={submit}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showThankYouModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title id="contained-modal-title-vcenter">
            Thank You
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your feedback has been submitted!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Okay</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FeedbackModal;
