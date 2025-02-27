import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { OrganizationSummaryItem } from '../../data-contracts/OrganizationSummaryItem';
import { Role, RoleDisplayNames } from '../../config/role';
import { useMutation, useQueryClient } from 'react-query';
import { searchUsers } from '../../accessors/userAccessor';
import { useMsal } from '@azure/msal-react';
import { useDebounceCallback } from '@react-hook/debounce';
import Alert from 'react-bootstrap/esm/Alert';
import { addOrganizationMemeber } from '../../accessors/organizationAccessor';
import { toast } from 'react-toastify';
import { useAuthenticationContext } from '../../hooks/useAuthenticationContext';

interface AddUserModalProps extends ModalProps {
  organization: OrganizationSummaryItem | undefined;
}

function AddUserModal(props: AddUserModalProps) {
  const roleOptions = [
    { value: Role.Member, label: RoleDisplayNames[Role.Member] },
    { value: Role.TechnicalReviewer, label: RoleDisplayNames[Role.TechnicalReviewer] },
    { value: Role.OrganizationAdmin, label: RoleDisplayNames[Role.OrganizationAdmin] },
  ];

  const maxUserSearchResults = 20;
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [selectedUser, setSelectedUser] = useState<UserSelectOption | null>(null);
  const [maxResultsReturned, setMaxResultsReturned] = useState(false);
  const queryClient = useQueryClient();
  const msalContext = useMsal();
  const { user } = useAuthenticationContext();

  const addOrganizationMemeberMutation = useMutation({
    mutationFn: async (params: { organizationId: string; userId: string; role: string }) => {
      return await addOrganizationMemeber(msalContext, params.organizationId, params.userId, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('organizationUsers');
      props.onHide?.();
      toast.success('User added to organization', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 1000,
      });
    },
    onError: (error: { status?: number }) => {
      if (error?.status === 409) {
        toast.error('User is already a member of an organization', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
      } else {
        toast.error('Error adding user to organization', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
      }
    },
  });

  interface UserSelectOption {
    value: string;
    label: string;
    fullName: string;
    userName: string;
  }

  const handleRoleChange = (option: { value: Role } | null) => setSelectedRole(option?.value);
  const handleUserChange = (option: UserSelectOption | null) => setSelectedUser(option);

  useEffect(() => {
    if (!props.show) {
      setSelectedRole(undefined);
      setSelectedUser(null);
      setMaxResultsReturned(false);
    }
  }, [props.show]);

  const loadUserOptions = useDebounceCallback((inputValue: string, callback: (options: UserSelectOption[]) => void) => {
    if (inputValue.trim().length < 3) {
      callback([]);
      return;
    }

    queryClient
      .fetchQuery(['searchUsers', inputValue], () => searchUsers(msalContext, inputValue))
      .then((searchResults) => {
        const options = searchResults?.searchResults
          ?.filter((result) => {
            // Exclude current user from search results
            return result.userId !== user?.userId;
          })
          ?.map(
            (result): UserSelectOption => ({
              value: result.userId,
              label: `${result.firstName} ${result.lastName}, ${result.userName}`,
              fullName: `${result.firstName} ${result.lastName}`,
              userName: result.userName,
            }),
          );

        setMaxResultsReturned(options.length >= maxUserSearchResults);

        callback(options || []);
      });
  }, 200);

  const handleAddUserClick = () => {
    if (!selectedUser || !selectedRole) {
      return;
    }

    addOrganizationMemeberMutation.mutate({
      organizationId: props.organization?.organizationId ?? '',
      userId: selectedUser.value,
      role: selectedRole,
    });
  };

  return (
    <Modal show={props.show} centered onHide={props.onHide} className="add-user-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          Add a User
          <p className="fs-6 m-0 mt-2">{props.organization?.name}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {maxResultsReturned && (
          <Alert variant="warning" className="fw-bold mb-3">
            Showing first {maxUserSearchResults} results. Narrow your search to find more users.
          </Alert>
        )}
        <AsyncSelect
          isDisabled={addOrganizationMemeberMutation.isLoading}
          cacheOptions
          loadOptions={loadUserOptions}
          onChange={handleUserChange}
          placeholder="Search User to Add"
          value={selectedUser}
          components={{
            NoOptionsMessage: (a) => (
              <p className="text-muted text-center py-2 m-0">
                {a.selectProps.inputValue.length < 3 ? 'Enter at least 3 characters' : 'No results found'}
              </p>
            ),
            Option: (props) => (
              <div
                className="d-flex justify-content-between p-2 user-select-none user-select-option"
                onClick={() => props.selectOption(props.data)}
                role="option"
              >
                <div className="fw-bold">{props.data.fullName}</div>
                <div>{props.data.userName}</div>
              </div>
            ),
          }}
        />
        <Select
          isDisabled={addOrganizationMemeberMutation.isLoading}
          options={roleOptions}
          onChange={handleRoleChange}
          placeholder="Select Role"
          name="role"
          getOptionLabel={(value) => RoleDisplayNames[value.value]}
          value={roleOptions.find((x) => x.value === selectedRole)}
          className="mt-3"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide} disabled={addOrganizationMemeberMutation.isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddUserClick}
          disabled={!selectedUser || !selectedRole || addOrganizationMemeberMutation.isLoading}
        >
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
