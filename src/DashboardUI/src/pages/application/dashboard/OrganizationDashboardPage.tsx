import { useMsal } from '@azure/msal-react';
import { mdiCircleMedium } from '@mdi/js';
import Icon from '@mdi/react';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import moment from 'moment';
import { Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { applicationSearch } from '../../../accessors/applicationAccessor';
import { TableLoading } from '../../../components/TableLoading';
import { Role } from '../../../config/role';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationDashboardListItem } from '../../../data-contracts/ApplicationDashboardListItem';
import { formatCompensationRateUnitsText } from '../../../data-contracts/CompensationRateUnits';
import {
  ConservationApplicationStatus,
  formatConservationApplicationStatusText,
} from '../../../data-contracts/ConservationApplicationStatus';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { hasUserRole } from '../../../utilities/securityHelpers';

import './organization-dashboard-page.scss';

export function OrganizationDashboardPage() {
  const { user } = useAuthenticationContext();
  const { state, dispatch } = useConservationApplicationContext();
  const msalContext = useMsal();

  let organizationIdFilter = undefined;

  // TODO: JN - why is my user null
  if (!hasUserRole(user, Role.GlobalAdmin)) {
    const organizationIds = [...new Set(user?.organizationRoles?.map((orgRole) => orgRole.organizationId))];
    if (organizationIds.length !== 1) {
      // TODO: JN - throw an error?
    }
    organizationIdFilter = organizationIds[0];
  }

  const { isLoading, isError } = useQuery('organization-dashboard-load', {
    queryFn: () => applicationSearch(msalContext, organizationIdFilter),
    onSuccess(data) {
      dispatch({ type: 'DASHBOARD_APPLICATIONS_LOADED', dashboardApplications: data.applications });
    },
  });

  const columns: GridColDef[] = [
    { field: 'applicant', headerName: 'Applicant', width: 200, renderHeader },
    { field: 'waterRightNativeId', headerName: 'Water Right Native ID', width: 200, renderHeader },
    { field: 'applicationDisplayId', headerName: 'Application ID', width: 200, renderHeader },
    { field: 'submittedDate', headerName: 'Date Submitted', width: 150, renderHeader, valueFormatter: formatDate },
    { field: 'requestedFunding', headerName: 'Requested Funding', width: 200, renderHeader },
    { field: 'waterRightState', headerName: 'State', renderHeader },
    { field: 'fundingOrganization', headerName: 'Funding Organization', width: 300, renderHeader },
    { field: 'applicationStatus', headerName: 'Status', width: 200, renderCell: renderAppStatusCell, renderHeader },
  ];

  const rows: GridRowsProp =
    state.dashboardApplications.map((app: ApplicationDashboardListItem) => {
      return {
        id: app.applicationId,
        applicant: app.applicantFullName,
        waterRightNativeId: app.waterRightNativeId,
        applicationDisplayId: app.applicationDisplayId,
        submittedDate: app.submittedDate,
        requestedFunding: `$${app.compensationRateDollars}/${formatCompensationRateUnitsText(app.compensationRateUnits)}`,
        waterRightState: app.waterRightState,
        fundingOrganization: app.organizationName,
        applicationStatus: app.status,
      };
    }) ?? [];

  let pageTitle = '';

  let uniqueOrgs = [...new Set(state.dashboardApplications.map((app) => app.organizationName))];

  if (hasUserRole(user, Role.GlobalAdmin) || uniqueOrgs.length > 1) {
    pageTitle = 'Organization Dashboard';
  } else {
    pageTitle = uniqueOrgs[0];
  }

  return (
    <div>
      <div className="m-3">
        <h1 className="fs-3 fw-bolder">{pageTitle}</h1>
        <div className="row my-4">
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Submitted Applications', 42)}</div>
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Accepted Applications', 42)}</div>
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Rejected Applications', 42)}</div>
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Applications In Review', 42)}</div>
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Cumulative Est. Savings', 42)}</div>
          <div className="col-md-2 col-sm-4 col-6 my-1">{renderCard('Total Obligation', 42)}</div>
        </div>
        <h2 className="fs-5 mt-5">Applications</h2>
        <TableLoading isLoading={isLoading} isErrored={isError}>
          <DataGrid rows={rows} columns={columns}></DataGrid>
        </TableLoading>
      </div>
    </div>
  );
}

const formatDate = (date: Date) => {
  return moment(date).format('MM/DD/YYYY');
};

const renderHeader = (params: GridColumnHeaderParams) => (
  <div className="header-column-text">{params.colDef.headerName}</div>
);

const renderAppStatusCell = (params: GridRenderCellParams<any, ConservationApplicationStatus>) => (
  <>
    <Icon
      size={1}
      path={mdiCircleMedium}
      className={getApplicationStatusIconClass(params.value!)}
      title={formatConservationApplicationStatusText(params.value!)}
    ></Icon>
    {formatConservationApplicationStatusText(params.value!)}
  </>
);

const renderCard = (description: string, value: number) => {
  return (
    <Card className="rounded-3 shadow-sm text-center">
      <Card.Title className="mt-3 fs-1">{value}</Card.Title>
      <Card.Text className="mb-3 fs-6">{description}</Card.Text>
    </Card>
  );
};

function getApplicationStatusIconClass(status: ConservationApplicationStatus): string {
  switch (status) {
    case ConservationApplicationStatus.Approved:
      return 'application-status-icon-approved';
    case ConservationApplicationStatus.Rejected:
      return 'application-status-icon-rejected';
    case ConservationApplicationStatus.InReview:
      return 'application-status-icon-inReview';
    case ConservationApplicationStatus.Unknown:
      return 'application-status-icon-unknown';
  }
}
