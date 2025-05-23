import Button from 'react-bootstrap/esm/Button';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';

export interface ApplicationReviewButtonRowProps {
  isHidden: boolean;
  isFormDirty: boolean;
  isFormSubmitting: boolean;
  handleCancelClicked: () => void;
  handleSaveClicked: () => void;
  handleSubmitForFinalReviewClicked: () => void;
}

export function ApplicationReviewButtonRow(props: ApplicationReviewButtonRowProps) {
  const {
    isHidden,
    isFormDirty,
    isFormSubmitting,
    handleCancelClicked,
    handleSaveClicked,
    handleSubmitForFinalReviewClicked,
  } = props;
  const { state } = useConservationApplicationContext();

  if (isHidden) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between p-3">
      <div>
        <Button variant="secondary" onClick={handleCancelClicked} disabled={isFormSubmitting}>
          Cancel
        </Button>
      </div>

      <div className="d-flex gap-3">
        <Button
          variant="outline-success"
          onClick={handleSaveClicked}
          disabled={state.isUploadingDocument || !isFormDirty || isFormSubmitting}
        >
          Save Changes
        </Button>

        <Button
          variant="success"
          onClick={handleSubmitForFinalReviewClicked}
          disabled={isFormSubmitting || state.isUploadingDocument}
        >
          Submit Recommendation
        </Button>
      </div>
    </div>
  );
}
