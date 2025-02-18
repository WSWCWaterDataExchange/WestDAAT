import { useMsal } from '@azure/msal-react';
import { mdiCircleMedium } from '@mdi/js';
import { Icon } from '@mdi/react';
import { DataGrid, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import { Placeholder } from 'react-bootstrap';
import Card from 'react-bootstrap/esm/Card';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { applicationSearch } from '../../../accessors/applicationAccessor';
import { TableLoading } from '../../../components/TableLoading';
import { Role } from '../../../config/role';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationDashboardListItem } from '../../../data-contracts/ApplicationDashboardListItem';
import { CompensationRateUnitsLabels } from '../../../data-contracts/CompensationRateUnits';
import {
  ConservationApplicationStatus,
  ConservationApplicationStatusDisplayNames,
} from '../../../data-contracts/ConservationApplicationStatus';
import { useOrganizationQuery } from '../../../hooks/queries';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { DataGridColumns, DataGridRows } from '../../../typings/TypeSafeDataGrid';
import { getUserOrganization, hasUserRole } from '../../../utilities/securityHelpers';
import { formatDateString } from '../../../utilities/valueFormatters';
import { dataGridDateRangeFilter } from './DataGridDateRangeFilter';

import './organization-dashboard-page.scss';

interface ApplicationDataGridColumns {
  applicant: string;
  waterRightNativeId: string;
  applicationDisplayId: string;
  submittedDate: Date;
  requestedFunding: string;
  waterRightState: string;
  fundingOrganization: string;
  applicationStatus: ConservationApplicationStatus;
}

export function OrganizationDashboardPage() {
  const { user } = useAuthenticationContext();
  const { state, dispatch } = useConservationApplicationContext();
  const msalContext = useMsal();

  const organizationIdFilter = !hasUserRole(user, Role.GlobalAdmin) ? getUserOrganization(user) : null;

  const { data: organizationListResponse, isLoading: organizationListLoading } = useOrganizationQuery();

  const { isLoading, isError } = useQuery(['organization-dashboard-load', organizationIdFilter], {
    queryFn: () => applicationSearch(msalContext, organizationIdFilter),
    onSuccess(data) {
      dispatch({ type: 'DASHBOARD_APPLICATIONS_LOADED', payload: { dashboardApplications: data.applications } });
    },
  });

  const dateFormatter = (date: Date) => {
    return formatDateString(date, 'MM/DD/YYYY');
  };

  const getApplicationStatusIconClass = (status: ConservationApplicationStatus): string => {
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
  };

  const renderHeader = (params: GridColumnHeaderParams) => (
    <div className="header-column-text">{params.colDef.headerName}</div>
  );

  const renderAppStatusCell = (params: GridRenderCellParams<any, string>) => {
    return (
      <>
        <Icon
          size={1}
          path={mdiCircleMedium}
          className={getApplicationStatusIconClass(params.row.applicationStatus)}
          title={params.value!}
        ></Icon>
        {params.value!}
      </>
    );
  };

  const renderWaterRightCell = (params: GridRenderCellParams<any, string>) => {
    return <NavLink to={`/details/right/${params.value}`}>{params.value}</NavLink>;
  };

  const renderAppIdCell = (params: GridRenderCellParams<any, string>) => {
    const waterRightId = `${params.row.waterRightState}wr_WR${params.row.waterRightNativeId}`;
    return <NavLink to={`/application/${waterRightId}/review`}>{params.value}</NavLink>;
  };

  const renderStatisticsCard = (description: string, value: number) => {
    return (
      <div className="col-md-2 col-sm-4 col-6 my-1">
        <Card className="rounded-3 shadow-sm text-center">
          <Card.Title className="mt-3 fs-1">{value}</Card.Title>
          <Card.Text className="mb-3 fs-6">{description}</Card.Text>
        </Card>
      </div>
    );
  };

  const dashboardTitle = () => {
    if (organizationListLoading) {
      return (
        <Placeholder as="h1" animation="glow" className="fs-3 fw-bolder">
          <Placeholder xs={4} className="rounded" />
        </Placeholder>
      );
    }

    let titleText = 'Application Dashboard';
    if (organizationIdFilter) {
      const organization = organizationListResponse?.organizations.find(
        (org) => org.organizationId === organizationIdFilter,
      );

      if (organization) {
        titleText = `${organization.name} Dashboard`;
      }
    }

    return <h1 className="fs-3 fw-bolder">{titleText}</h1>;
  };

  const columns: DataGridColumns<ApplicationDataGridColumns>[] = [
    { field: 'applicant', headerName: 'Applicant', width: 200, renderHeader },
    {
      field: 'waterRightNativeId',
      headerName: 'Water Right Native ID',
      width: 200,
      renderHeader,
      renderCell: renderWaterRightCell,
    },
    {
      field: 'applicationDisplayId',
      headerName: 'Application ID',
      width: 200,
      renderHeader,
      renderCell: renderAppIdCell,
    },
    {
      field: 'submittedDate',
      headerName: 'Date Submitted',
      width: 150,
      renderHeader,
      valueFormatter: dateFormatter,
      filterOperators: [dataGridDateRangeFilter],
    },
    { field: 'requestedFunding', headerName: 'Requested Funding', width: 200, renderHeader },
    { field: 'waterRightState', headerName: 'State', renderHeader },
    { field: 'fundingOrganization', headerName: 'Funding Organization', width: 300, renderHeader },
    {
      field: 'applicationStatus',
      headerName: 'Status',
      width: 200,
      renderCell: renderAppStatusCell,
      renderHeader,
      valueGetter: (status: ConservationApplicationStatus) => ConservationApplicationStatusDisplayNames[status],
    },
  ];

  const rows: DataGridRows<ApplicationDataGridColumns> =
    state.dashboardApplications.map((app: ApplicationDashboardListItem) => {
      return {
        id: app.applicationId,
        applicant: app.applicantFullName,
        waterRightNativeId: app.waterRightNativeId,
        applicationDisplayId: app.applicationDisplayId,
        submittedDate: app.submittedDate,
        requestedFunding: `$${app.compensationRateDollars}/${CompensationRateUnitsLabels[app.compensationRateUnits]}`,
        waterRightState: app.waterRightState,
        fundingOrganization: app.organizationName,
        applicationStatus: app.status,
      };
    }) ?? [];

  return (
    <div className="overflow-y-auto h-100">
      <div className="m-3">
        {dashboardTitle()}
        <div className="row my-4">
          {renderStatisticsCard('Submitted Applications', 42)}
          {renderStatisticsCard('Accepted Applications', 42)}
          {renderStatisticsCard('Rejected Applications', 42)}
          {renderStatisticsCard('Applications In Review', 42)}
          {renderStatisticsCard('Cumulative Est. Savings', 42)}
          {renderStatisticsCard('Total Obligation', 42)}
        </div>
        <h2 className="fs-5 mt-5">Applications</h2>
        <TableLoading isLoading={isLoading} isErrored={isError}>
          <DataGrid
            rows={rows}
            columns={columns}
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  valueInputProps: {
                    sx: {
                      width: 'auto', // This prevents the filter from having a horizontal scrollbar
                    },
                  },
                },
              },
            }}
          ></DataGrid>
        </TableLoading>
      </div>
    </div>
  );
}
