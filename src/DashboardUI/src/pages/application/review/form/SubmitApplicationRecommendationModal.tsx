import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import { useMutation } from 'react-query';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { submitApplicationRecommendation } from '../../../../accessors/applicationAccessor';
import {
  RecommendationDecision,
  RecommendationDecisionDisplayNames,
} from '../../../../data-contracts/RecommendationDecision';

export interface SubmitApplicationRecommendationModalProps {
  show: boolean;
  applicationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitApplicationRecommendationModal(props: SubmitApplicationRecommendationModalProps) {
  const context = useMsal();
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

  const submitApplicationRecommendationMutation = useMutation({
    mutationFn: async (recommendation: { decision: RecommendationDecision; notes: string | undefined }) => {
      return await submitApplicationRecommendation(context, {
        waterConservationApplicationId: props.applicationId,
        recommendationDecision: recommendation.decision,
        recommendationNotes: recommendation.notes,
      });
    },
    onSuccess: () => {
      toast.success('Application recommendation submitted successfully.', {
        autoClose: 1000,
      });
      setRecommendationDecision(undefined);
      setRecommendationNotes(undefined);
      props.onSuccess();
    },
    onError: () => {
      toast.error('Error submitting application recommendation.', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
    },
  });

  const handleDecisionChange = (option: { value: RecommendationDecision } | null) =>
    setRecommendationDecision(option?.value);

  const handleCancelClicked = () => {
    props.onClose();
    setRecommendationDecision(undefined);
    setRecommendationNotes(undefined);
  };

  const handleSubmitClicked = () => {
    if (!recommendationDecision) {
      throw new Error('Recommendation decision is required.');
    }

    submitApplicationRecommendationMutation.mutate({
      decision: recommendationDecision,
      notes: recommendationNotes,
    });
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
            <div className="mt-3">Select Status:</div>
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
        <Button
          variant="secondary"
          onClick={handleCancelClicked}
          disabled={submitApplicationRecommendationMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmitClicked}
          disabled={!recommendationDecision || submitApplicationRecommendationMutation.isLoading}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
