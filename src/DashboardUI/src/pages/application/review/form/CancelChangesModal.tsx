import ConfirmationModal from '../../../../components/ConfirmationModal';

export interface CancelChangesModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CancelChangesModal(props: CancelChangesModalProps) {
  return (
    <ConfirmationModal
      show={props.show}
      onCancel={props.onCancel}
      onConfirm={props.onConfirm}
      titleText="Are you sure you want to leave?"
      cancelText="Cancel"
      confirmText="Okay"
    >
      Any changes to this application will not be saved.
    </ConfirmationModal>
  );
}
