import Button from 'react-bootstrap/esm/Button';
import Modal, { ModalProps } from 'react-bootstrap/esm/Modal';
import { OrganizationSummaryItem } from '../../data-contracts/OrganizationSummaryItem';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { Role, RoleDisplayNames } from '../../config/role';

interface AddUserModalProps extends ModalProps {
  organization: OrganizationSummaryItem | undefined;
}

function AddUserModal(props: AddUserModalProps) {
  const roleOptions = [
    { value: Role.Member, label: RoleDisplayNames[Role.Member] },
    { value: Role.TechnicalReviewer, label: RoleDisplayNames[Role.TechnicalReviewer] },
    { value: Role.OrganizationAdmin, label: RoleDisplayNames[Role.OrganizationAdmin] },
  ];

  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  const handleRoleChange = (option: Role | undefined) => setSelectedRole(option);

  useEffect(() => {
    // When the modal is closed, reset state
    if (!props.show) {
      setSelectedRole(undefined);
    }
  }, [props.show]);

  return (
    <Modal show={props.show} centered>
      <Modal.Header>
        <Modal.Title>
          Add a User
          <p className="fs-6 m-0 mt-2">{props.organization?.name}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Select
          options={roleOptions}
          onChange={(r) => handleRoleChange(r?.value)}
          placeholder="Select Role"
          name="role"
          getOptionLabel={(value) => RoleDisplayNames[value.value]}
          value={roleOptions.find((x) => x.value === selectedRole)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button onClick={() => alert('This feature will be implemented in a future release.')}>Add User</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
