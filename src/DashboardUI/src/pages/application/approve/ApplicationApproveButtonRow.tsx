import Button from 'react-bootstrap/esm/Button';

export interface ApplicationApproveButtonRowProps {
  disableButtons: boolean;
  handleAcceptClicked: () => void;
  handleDenyClicked: () => void;
}

export function ApplicationApproveButtonRow(props: ApplicationApproveButtonRowProps) {
  const { disableButtons: isFormSubmitting, handleAcceptClicked, handleDenyClicked } = props;

  return (
    <div className="d-flex justify-content-end p-3 gap-3">
      <Button variant="danger" onClick={handleDenyClicked} disabled={isFormSubmitting} className="px-3">
        Deny
      </Button>

      <Button variant="success" onClick={handleAcceptClicked} disabled={isFormSubmitting} className="px-3">
        Accept
      </Button>
    </div>
  );
}
