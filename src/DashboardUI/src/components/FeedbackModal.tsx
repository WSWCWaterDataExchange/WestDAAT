import { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { FeedbackRequest } from '../data-contracts/FeedbackRequest';
import { postFeedback } from '../accessors/systemAccessor';

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
  const [organizationValue, setOrganizationValue] = useState<string>("");
  const [roleValue, setRoleValue] = useState<string>("");
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [showErrorLabel, setShowErrorLabel] = useState<boolean>(false);

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

  const submit = () => {
    const feedbackRequest = new FeedbackRequest();

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
    if ((feedbackRequest.comments !== null && feedbackRequest.comments !== "")
    || (feedbackRequest.email !== null && feedbackRequest.email !== "")
    || (feedbackRequest.organization !== null && feedbackRequest.organization !== "")
    || (feedbackRequest.role !== null && feedbackRequest.role !== "")
    || (feedbackRequest.satisfactionLevel !== null && feedbackRequest.satisfactionLevel !== "")
    || (feedbackRequest.dataInterest?.length !== 0 && feedbackRequest.dataInterest?.every(interest => interest !== ""))
    || (feedbackRequest.dataUsage?.length !== 0 && feedbackRequest.dataUsage?.every(use => use !== ""))){
      postFeedback(feedbackRequest);
      setShowThankYouModal(true);
      props.setShow(false);
      clearCollections();
    }else{
      setShowErrorLabel(true);
    }
  }

  const clearCollections = () => {
    setShowErrorLabel(false);
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
            <label className="form-label fw-bolder">Comments(Optional)</label>
            <input type="text" className="form-control" placeholder="Anything will help us improve" onChange={(e) => setCommentsValue(e.target.value ?? "")} value={commentsValue} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bolder">Email(Optional)</label>
            <input type="text" className="form-control" placeholder="email@domain.com" onChange={(e) => setEmailValue(e.target.value ?? "")} value={emailValue} />
          </div>
          <div className="mb-3">
            <label className="fw-bolder">Professional Organization(Optional)</label> <br />
            <select name="formGroupOrganizationSelect" className="form-select" onChange={(e) => setOrganizationValue(e.target.value ?? "")} value={organizationValue}>
              <option value="">Please Select</option>
              <option value="Organization 1">Organization 1</option>
              <option value="Organization 2">Organization 2</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="fw-bolder">Role(Optional)</label> <br />
            <select name="formGroupRoleSelect" className="form-select" onChange={(e) => setRoleValue(e.target.value ?? "")} value={roleValue}>
              <option value="">Please Select</option>
              <option value="option 1">Role 1</option>
              <option value="option 2">Role 2</option>
            </select>
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
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
                passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
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
