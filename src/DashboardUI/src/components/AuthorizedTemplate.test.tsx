import React from 'react';
import { render } from '@testing-library/react';
import AuthorizedTemplate from './AuthorizedTemplate';
import { useAuthenticationContext } from '../hooks/useAuthenticationContext';
import { Role } from '../config/role';

jest.mock('../hooks/useAuthenticationContext');

const mockUseAuthenticationContext = useAuthenticationContext as jest.MockedFunction<typeof useAuthenticationContext>;

describe('AuthorizedTemplate', () => {
  it('renders children when user has required role', () => {
    mockUseAuthenticationContext.mockReturnValue({
      isAuthenticated: true,
      authenticationComplete: true,
      user: {
        emailAddress: 'wesley@westdaat.com',
        roles: [Role.GlobalAdmin],
        organizationRoles: [],
      },
    });

    const { getByText } = render(
      <AuthorizedTemplate roles={[Role.GlobalAdmin]}>
        <div>Authorized Content</div>
      </AuthorizedTemplate>,
    );

    expect(getByText('Authorized Content')).toBeInTheDocument();
  });

  it('renders children when user has required organization role', () => {
    mockUseAuthenticationContext.mockReturnValue({
      isAuthenticated: true,
      authenticationComplete: true,
      user: {
        emailAddress: 'wesley@westdaat.com',
        roles: [],
        organizationRoles: [
          {
            organizationId: 'org1',
            roles: [Role.OrganizationAdmin],
          },
        ],
      },
    });

    const { getByText } = render(
      <AuthorizedTemplate roles={[Role.OrganizationAdmin]}>
        <div>Authorized Content</div>
      </AuthorizedTemplate>,
    );

    expect(getByText('Authorized Content')).toBeInTheDocument();
  });

  it('does not render children when user does not have required role', () => {
    mockUseAuthenticationContext.mockReturnValue({
      isAuthenticated: true,
      authenticationComplete: true,
      user: {
        emailAddress: 'wesley@westdaat.com',
        roles: [Role.Member],
        organizationRoles: [],
      },
    });

    const { queryByText } = render(
      <AuthorizedTemplate roles={[Role.TechnicalReviewer]}>
        <div>Authorized Content</div>
      </AuthorizedTemplate>,
    );

    expect(queryByText('Authorized Content')).not.toBeInTheDocument();
  });

  it('does not render children when user is not authenticated', () => {
    mockUseAuthenticationContext.mockReturnValue({
      isAuthenticated: false,
      authenticationComplete: true,
      user: null,
    });

    const { queryByText } = render(
      <AuthorizedTemplate roles={[Role.Member]}>
        <div>Authorized Content</div>
      </AuthorizedTemplate>,
    );

    expect(queryByText('Authorized Content')).not.toBeInTheDocument();
  });
});
