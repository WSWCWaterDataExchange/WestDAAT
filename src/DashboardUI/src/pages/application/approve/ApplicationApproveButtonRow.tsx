import Button from 'react-bootstrap/esm/Button';

export interface ApplicationApproveButtonRowProps {
  isHidden: boolean;
  disableButtons: boolean;
  handleAcceptClicked: () => void;
  handleDenyClicked: () => void;
}

export function ApplicationApproveButtonRow(props: ApplicationApproveButtonRowProps) {
  const { disableButtons, handleAcceptClicked, handleDenyClicked } = props;

  if (props.isHidden) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end p-3 gap-3">
      <Button variant="danger" onClick={handleDenyClicked} disabled={disableButtons} className="px-3">
        Deny
      </Button>

      <Button variant="success" onClick={handleAcceptClicked} disabled={disableButtons} className="px-3">
        Accept
      </Button>
    </div>
  );
}
