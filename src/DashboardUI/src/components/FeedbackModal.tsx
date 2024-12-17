import React from 'react';
import { ChangeEvent, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { FeedbackRequest } from '../data-contracts/FeedbackRequest';
import { toast } from 'react-toastify';
import { postFeedback } from '../accessors/systemAccessor';
import validator from 'validator';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

interface FeedBackModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

const dashboardSatisfactionOptions: string[] = [
  'Very Satisfied',
  'Somewhat satisfied',
  'Neither satisfied nor dissatisfied',
  'Somewhat dissatisfied',
  'Very dissatisfied',
];

const dataUsageOptions: string[] = [
  'Demand Management',
  'General Interest',
  'Planning',
  'Regulatory',
  'Research',
  'Reservoir Management',
  'Thermoelectric / Hydropower Management',
  'Water Markets',
  'Water Quality',
  'Watershed Management',
];

const defaultFeedbackRequest = new FeedbackRequest();

function FeedbackModal(props: FeedBackModalProps) {
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [feedbackRequest, setFeedbackRequest] = useState(
    defaultFeedbackRequest,
  );

  const handleDataCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      return [...feedbackRequest.dataUsage, event.target.value];
    } else {
      const dataArray = [...feedbackRequest.dataUsage];
      dataArray.splice(
        feedbackRequest.dataUsage.indexOf(event.target.value),
        1,
      );
      return dataArray;
    }
  };

  const otherDataIndex = useMemo(() => {
    return feedbackRequest.dataUsage.findIndex((a) => a.startsWith('Other - '));
  }, [feedbackRequest.dataUsage]);

  const otherDataText = useMemo(() => {
    return otherDataIndex >= 0
      ? feedbackRequest.dataUsage[otherDataIndex].replace(/Other\s-\s/, '')
      : '';
  }, [feedbackRequest.dataUsage, otherDataIndex]);

  const handleOtherDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value?.trim()
      ? [`Other - ${event.target.value}`]
      : [];
    if (otherDataIndex < 0) {
      return [...feedbackRequest.dataUsage, ...newValue];
    }
    const dataArray = [...feedbackRequest.dataUsage];
    dataArray.splice(otherDataIndex, 1, ...newValue);
    return dataArray;
  };

  const close = () => {
    props.setShow(false);
    setShowThankYouModal(false);
  };

  const submit = async () => {
    setShowThankYouModal(true);
    props.setShow(false);
    const result = await postFeedback({
      ...feedbackRequest,
      url: window.location.href,
    });
    if (result === false) {
      toast.error('Something went wrong sending the feedback', {
        position: 'top-center',
        theme: 'colored',
        autoClose: false,
      });
    } else {
      setFeedbackRequest(defaultFeedbackRequest);
    }
  };

  const isEmailValid = useMemo(() => {
    return !feedbackRequest.email || validator.isEmail(feedbackRequest.email);
  }, [feedbackRequest.email]);

  const isFormValid = useMemo(() => {
    return (
      isEmailValid &&
      ((feedbackRequest.comments !== null &&
        feedbackRequest.comments.trim() !== '') ||
        (feedbackRequest.email !== null &&
          feedbackRequest.email.trim() !== '') ||
        (feedbackRequest.firstName !== null &&
          feedbackRequest.firstName.trim() !== '') ||
        (feedbackRequest.lastName !== null &&
          feedbackRequest.lastName.trim() !== '') ||
        (feedbackRequest.organization !== null &&
          feedbackRequest.organization.trim() !== '') ||
        (feedbackRequest.role !== null && feedbackRequest.role.trim() !== '') ||
        (feedbackRequest.satisfactionLevel !== null &&
          feedbackRequest.satisfactionLevel.trim() !== '') ||
        feedbackRequest.dataUsage?.length !== 0)
    );
  }, [feedbackRequest, isEmailValid]);

  return (
    <>
      <Modal
        show={props.show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="xl"
        onHide={close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send Feedback
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please let us know your feedback about the Water Data Exchange Data
            (WaDE) Tool.
          </p>
          <p>
            Contact us:{' '}
            <a
              href="https://westernstateswater.org/wade/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://westernstateswater.org/wade/contact-us/
            </a>
          </p>
          <div className="row mb-3">
            <div className="col">
              <label className="fw-bolder">First Name</label>
              <input
                className="form-control"
                placeholder="John"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    firstName: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.firstName}
              />
            </div>
            <div className="col">
              <label className="fw-bolder">Last Name</label>
              <input
                className="form-control"
                placeholder="Doe"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    lastName: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.lastName}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="fw-bolder">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email@domain.com"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    email: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.email}
              />
              {!isEmailValid && (
                <label className="text-danger">
                  Please use a valid email address
                </label>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="fw-bolder">Professional Organization</label>{' '}
              <br />
              <input
                className="form-control"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    organization: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.organization}
              />
            </div>
            <div className="col">
              <label className="fw-bolder">Role</label> <br />
              <input
                className="form-control"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    role: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.role}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="fw-bolder">Comments</label>
              <textarea
                className="form-control"
                onChange={(e) =>
                  setFeedbackRequest({
                    ...feedbackRequest,
                    comments: e.target.value ?? '',
                  })
                }
                value={feedbackRequest.comments}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bolder">How do you use the data?</label>
            <div className="row">
              {dataUsageOptions.map((element) => {
                const idValue = `data-usage-${element}`;
                return (
                  <div className="col-4" key={idValue}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={element}
                        id={idValue}
                        checked={feedbackRequest.dataUsage.includes(element)}
                        onChange={(e) =>
                          setFeedbackRequest({
                            ...feedbackRequest,
                            dataUsage: handleDataCheckChange(e),
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={idValue}>
                        {element}
                      </label>
                    </div>
                  </div>
                );
              })}
              <div className="col-8">
                <div className="input-group input-group-sm">
                  <label
                    className="input-group-text"
                    id="other-usage-label"
                    htmlFor="data-usage-other"
                  >
                    Other
                  </label>
                  <input
                    type="text"
                    id="data-usage-other"
                    className="form-control form-control-sm"
                    onChange={(e) =>
                      setFeedbackRequest({
                        ...feedbackRequest,
                        dataUsage: handleOtherDataChange(e),
                      })
                    }
                    value={otherDataText}
                    aria-label="Other Usage"
                    aria-describedby="other-usage-label"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3" id="dashboardSatisfactionLevel">
            <label className="fw-bolder">
              How satisfied are you with the Water Data Exchange Data (WaDE)
              Tool?
            </label>
            <ButtonGroup className="w-100">
              {dashboardSatisfactionOptions.map((element) => (
                <ToggleButton
                  className="zindexzero"
                  key={element}
                  id={`satisfactionRadio-${element}`}
                  type="radio"
                  variant="outline-primary"
                  name="satisfactionRadio"
                  value={element}
                  checked={feedbackRequest.satisfactionLevel === element}
                  onChange={() =>
                    setFeedbackRequest({
                      ...feedbackRequest,
                      satisfactionLevel: element ?? '',
                    })
                  }
                >
                  {element}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {!isFormValid && (
            <label className="text-danger">
              Please fill at least one field before submitting
            </label>
          )}
          <Button onClick={submit} disabled={!isFormValid}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showThankYouModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thank You
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your feedback has been submitted!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Okay</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FeedbackModal;
