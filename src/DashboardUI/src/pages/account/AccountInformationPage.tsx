import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';
import { useUserProfile } from '../../hooks/queries/useUserQuery';

export function AccountInformationPage() {
  const { data: profileResponse } = useUserProfile();

  const profile = profileResponse?.userProfile;

  const labeledValue = (label: string, value: string) => (
    <div className="col-xxl-2 col-lg-3 col-md-4">
      <div className="mb-4">
        <div className="text-muted">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid mt-3">
      <h1 className="fw-bold fs-4 mb-4">My Account</h1>
      <h2 className="fs-4">Account Information</h2>
      <hr />

      {profile && (
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
