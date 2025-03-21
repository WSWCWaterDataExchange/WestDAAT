import { mdiCircleMedium } from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  DataGrid,
  GridColumnHeaderParams,
  GridFilterItem,
  GridFilterState,
  GridRenderCellParams,
  GridState,
  GridToolbarContainer,
  GridToolbarExport,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useDebounceCallback } from '@react-hook/debounce';
import deepEqual from 'fast-deep-equal/es6';
import { useState } from 'react';
import Card from 'react-bootstrap/esm/Card';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { NavLink } from 'react-router-dom';
import { TableLoading } from '../../../components/TableLoading';
import { Role } from '../../../config/role';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationDashboardListItem } from '../../../data-contracts/ApplicationDashboardListItem';
import { CompensationRateUnitsLabelsPlural } from '../../../data-contracts/CompensationRateUnits';
import {
  ConservationApplicationStatus,
  ConservationApplicationStatusDisplayNames,
} from '../../../data-contracts/ConservationApplicationStatus';
import { useOrganizationQuery } from '../../../hooks/queries';
import { useLoadDashboardApplications } from '../../../hooks/queries/useApplicationQuery';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { DataGridColumns, DataGridRows } from '../../../typings/TypeSafeDataGrid';
import { getUserOrganization, hasUserRole } from '../../../utilities/securityHelpers';
import { formatDateString, formatNumberToLargestUnit } from '../../../utilities/valueFormatters';
import { dataGridDateRangeFilter } from './DataGridDateRangeFilter';

import './organization-dashboard-page.scss';
import { ToastContainer } from 'react-toastify';

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
  const [dataGridFilters, setDataGridFilters] = useState<GridFilterItem[]>([]);
  const { user } = useAuthenticationContext();
  const { state, dispatch } = useConservationApplicationContext();
  const isGlobalAdmin = hasUserRole(user, Role.GlobalAdmin);
  const organizationIdFilter = !isGlobalAdmin ? getUserOrganization(user) : null;

  const { data: organizationListResponse, isLoading: organizationListLoading } = useOrganizationQuery();

  const { isLoading: applicationListLoading, isError: applicationListErrored } =
    useLoadDashboardApplications(organizationIdFilter);

  const apiRef = useGridApiRef();

  const getKeysFromLookup = (obj: GridFilterState['filteredRowsLookup']) => {
    const keys = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        keys.push(key);
      }
    }
    return keys;
  };

  const handleDataGridStateChange = useDebounceCallback((state: GridState) => {
    if (!deepEqual(dataGridFilters, state.filter.filterModel.items)) {
      setDataGridFilters(state.filter.filterModel.items);
      const filteredKeys = getKeysFromLookup(state.filter.filteredRowsLookup);
      const rows = filteredKeys.map((key) => apiRef.current.getRow(key));
      const applicationIds = rows.map((row) => row.id);

      dispatch({
        type: 'DASHBOARD_APPLICATION_FILTERS_CHANGED',
        payload: { applicationIds },
      });
    }
  }, 200);

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
    return <NavLink to={`/details/right/${params.row.waterRightState}wr_WR${params.value}`}>{params.value}</NavLink>;
  };

  const renderAppIdCell = (params: GridRenderCellParams<any, string>) => {
    const application = state.dashboardApplications.find((app) => app.applicationDisplayId === params.value)!;
    return <NavLink to={`/application/${application.applicationId}/review`}>{params.value}</NavLink>;
  };

  const renderStatisticsCard = (description: string, value: number | string | null, subtitle?: string) => {
    if (applicationListErrored) {
      value = '-';
      subtitle = undefined;
    }

    return (
      <div className="col-md-2 col-sm-4 col-6 my-1 align-self-stretch">
        <Card className="rounded-3 shadow-sm text-center h-100">
          <Card.Title className="mt-3 mx-3 fs-1 flex-grow-1 align-content-center">
            {applicationListLoading || value === null ? (
              <Placeholder animation="glow">
                <Placeholder xs={10} className="rounded" />
              </Placeholder>
            ) : (
              <span>{value}</span>
            )}
          </Card.Title>
          <Card.Text className="mb-3 mx-3 fs-6">
            {!applicationListLoading && subtitle && <p className="mb-1 w-100 fs-6 fw-bolder">{subtitle}</p>}
            {applicationListLoading ? (
              <Placeholder animation="glow">
                <Placeholder xs={10} className="rounded" />
              </Placeholder>
            ) : (
              <span>{description}</span>
            )}
          </Card.Text>
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

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
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
    { field: 'requestedFunding', headerName: 'Requested Funding', width: 200, renderHeader, filterable: false },
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
        requestedFunding: `$${app.compensationRateDollars}/${CompensationRateUnitsLabelsPlural[app.compensationRateUnits]}`,
        waterRightState: app.waterRightState,
        fundingOrganization: app.organizationName,
        applicationStatus: app.status,
      };
    }) ?? [];

  return (
    <main className="overflow-y-auto h-100">
      <div className="m-3">
        {dashboardTitle()}
        <div className="row my-4">
          {renderStatisticsCard('Submitted Applications', state.dashboardApplicationsStatistics.submittedApplications)}
          {renderStatisticsCard('Accepted Applications', state.dashboardApplicationsStatistics.acceptedApplications)}
          {renderStatisticsCard('Rejected Applications', state.dashboardApplicationsStatistics.rejectedApplications)}
          {renderStatisticsCard('Applications In Review', state.dashboardApplicationsStatistics.inReviewApplications)}
          {renderStatisticsCard(
            'Cumulative Est. Savings',
            formatNumberToLargestUnit(state.dashboardApplicationsStatistics.cumulativeEstimatedSavingsAcreFeet),
            'Acre-Feet',
          )}
          {renderStatisticsCard(
            'Total Obligation',
            `$${formatNumberToLargestUnit(state.dashboardApplicationsStatistics.totalObligationDollars)}`,
          )}
        </div>
        <h2 className="fs-5 mt-5">Applications</h2>
        <TableLoading isLoading={applicationListLoading} isErrored={applicationListErrored}>
          <DataGrid
            rows={rows}
            columns={columns}
            apiRef={apiRef}
            slots={{ toolbar: CustomToolbar }}
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
            onStateChange={handleDataGridStateChange}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  fundingOrganization: isGlobalAdmin ? true : false,
                },
              },
            }}
          ></DataGrid>
        </TableLoading>
      </div>

      {/* other pages queue messages to be displayed after navigating here  */}
      <ToastContainer />
    </main>
  );
}
