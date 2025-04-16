import Button from 'react-bootstrap/esm/Button';

export interface ApplicationApproveButtonRowProps {
  isHidden: boolean;
  disableButtons: boolean;
  handleApproveClicked: () => void;
  handleDenyClicked: () => void;
}

export function ApplicationApproveButtonRow(props: ApplicationApproveButtonRowProps) {
  const { disableButtons, handleApproveClicked, handleDenyClicked } = props;

  if (props.isHidden) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end p-3 gap-3">
      <Button variant="danger" onClick={handleDenyClicked} disabled={disableButtons} className="px-3">
        Deny
      </Button>

      <Button variant="success" onClick={handleApproveClicked} disabled={disableButtons} className="px-3">
        Approve
      </Button>
    </div>
  );
}
