import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import Select from 'react-select';
import {
  RecommendationDecision,
  RecommendationDecisionDisplayNames,
} from '../../../../data-contracts/RecommendationDecision';

export interface SubmitApplicationRecommendationModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (decision: RecommendationDecision, notes?: string) => void;
}

export function SubmitApplicationRecommendationModal(props: SubmitApplicationRecommendationModalProps) {
  const [recommendationDecision, setRecommendationDecision] = useState<RecommendationDecision | undefined>(undefined);
  const [recommendationNotes, setRecommendationNotes] = useState<string | undefined>(undefined);

  const decisionOptions = [
    {
      value: RecommendationDecision.For,
      label: RecommendationDecisionDisplayNames[RecommendationDecision.For],
    },
    {
      value: RecommendationDecision.Against,
      label: RecommendationDecisionDisplayNames[RecommendationDecision.Against],
    },
  ];

  const handleDecisionChange = (option: { value: RecommendationDecision } | null) =>
    setRecommendationDecision(option?.value);

  const handleCancelClicked = () => {
    props.onClose();
    setRecommendationDecision(undefined);
    setRecommendationNotes(undefined);
  };

  const handleSubmitClicked = () => {
    props.onSubmit(recommendationDecision!, recommendationNotes);
    setRecommendationDecision(undefined);
    setRecommendationNotes(undefined);
  };

  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={handleCancelClicked}>
        <Modal.Title>Submit Decision?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <div>Are you sure you want to submit your decision as it relates to this application?</div>
            <div>Select Status:</div>
            <div>
              <Select
                required
                id="application-recommendation-decision"
                placeholder="Select"
                name="recommendationDecision"
                aria-label="Recommendation Decision"
                className="mt-3"
                options={decisionOptions}
                onChange={handleDecisionChange}
                getOptionLabel={(selectedOption) => RecommendationDecisionDisplayNames[selectedOption.value]}
                value={decisionOptions.find((x) => x.value === recommendationDecision)}
              />
            </div>
            <div>
              <Form.Control
                id="application-recommendation-notes"
                placeholder="Provide any additional information regarding your recommendation decision. (Optional)"
                aria-label="Recommendation Decision Notes"
                className="mt-3"
                as="textarea"
                type="text"
                maxLength={4000}
                onChange={(e) => setRecommendationNotes(e.target.value)}
              ></Form.Control>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelClicked}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmitClicked} disabled={!recommendationDecision}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
