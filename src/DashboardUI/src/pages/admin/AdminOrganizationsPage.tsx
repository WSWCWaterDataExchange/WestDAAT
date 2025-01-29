import React from 'react';
import AuthorizedTemplate from '../../components/AuthorizedTemplate';
import { Role } from '../../config/role';

export function AdminOrganizationsPage() {
  return (
    <AuthorizedTemplate roles={[Role.GlobalAdmin]}>
      <h1>Admin Organizations Page</h1>
    </AuthorizedTemplate>
  );
}
