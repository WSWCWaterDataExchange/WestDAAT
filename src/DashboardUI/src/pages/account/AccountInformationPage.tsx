import Alert from 'react-bootstrap/esm/Alert';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';
import { useUserProfile } from '../../hooks/queries/useUserQuery';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';

export function AccountInformationPage() {
  const {
    data: profileResponse, //
    isLoading: isProfileLoading,
    isError: hasProfileLoadError,
  } = useUserProfile();

  const profile = profileResponse?.userProfile;

  const labeledValue = (label: string, value: string | undefined) => {
    return (
      <div className="col-xxl-2 col-lg-3 col-md-4">
        <div className="mb-4">
          {isProfileLoading && (
            <Placeholder animation="glow">
              <Placeholder xs={6} className="rounded" />
              <Placeholder xs={10} className="rounded" />
            </Placeholder>
          )}

          {!isProfileLoading && (
            <>
              <div className="text-muted">{label}</div>
              <div>{value}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-3">
      <h1 className="fw-bold fs-4 mb-4">My Account</h1>
      <h2 className="fs-4">Account Information</h2>
      <hr />

      {hasProfileLoadError && (
        <Alert variant="danger" className="d-flex align-items-center">
          <Icon path={mdiInformationOutline} size={1.3} />
          <span className="ms-2 fw-bold">There was an error loading your profile information. Please try again.</span>
        </Alert>
      )}

      {!hasProfileLoadError && (
        <div className="row">
          {labeledValue('Name', profile?.firstName + ' ' + profile?.lastName)}
          {labeledValue('Email', profile?.email)}
          {labeledValue('User ID', profile?.userName)}
          {labeledValue('State', profile?.state)}
          {labeledValue('Country', profile?.country)}
          {labeledValue('Phone', profile?.phoneNumber)}
        </div>
      )}

      <h2 className="fs-4">Address Information</h2>
      <hr />
      <NotImplementedPlaceholder />

      <h2 className="fs-4">Organizations & Roles</h2>
      <hr />
      <NotImplementedPlaceholder />
    </div>
  );
}
