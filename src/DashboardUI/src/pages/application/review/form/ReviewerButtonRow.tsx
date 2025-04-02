import Button from 'react-bootstrap/esm/Button';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';

export interface ReviewerButtonRowProps {
  isFormDirty: boolean;
  handleCancelClicked: () => void;
  handleSaveClicked: () => void;
  handleSubmitForFinalReviewClicked: () => void;
}

export function ReviewerButtonRow(props: ReviewerButtonRowProps) {
  const { isFormDirty, handleCancelClicked, handleSaveClicked, handleSubmitForFinalReviewClicked } = props;
  const { state } = useConservationApplicationContext();

  return (
    <div className="d-flex justify-content-between p-3">
      <div>
        <Button variant="secondary" onClick={handleCancelClicked}>
          Cancel
        </Button>
      </div>

      <div className="d-flex gap-3">
        <Button
          variant="outline-success"
          onClick={handleSaveClicked}
          disabled={state.isUploadingDocument || !isFormDirty}
        >
          Save Changes
        </Button>

        <Button variant="success" onClick={handleSubmitForFinalReviewClicked} disabled={state.isUploadingDocument}>
          Submit for Final Review
        </Button>
      </div>
    </div>
  );
}
