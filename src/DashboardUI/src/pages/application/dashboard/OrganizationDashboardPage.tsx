import { useMsal } from '@azure/msal-react';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { applicationSearch } from '../../../accessors/applicationAccessor';
import { TableLoading } from '../../../components/TableLoading';
import { ApplicationDashboardListItem } from '../../../data-contracts/ApplicationDashboardListItem';
import {
  ConservationApplicationStatus,
  formatConservationApplicationStatusText,
} from '../../../data-contracts/ConservationApplicationStatus';
import { FormattedDate } from '../../../components/FormattedDate';
import moment from 'moment';
import { formatCompensationRateUnitsText } from '../../../data-contracts/CompensationRateUnits';

export function OrganizationDashboardPage() {
  const applicationContext = useConservationApplicationContext();

  const msalContext = useMsal();

  const {
    data: organizationsList,
    isLoading,
    isError,
  } = useQuery('organization-dashboard-load', () => applicationSearch(msalContext));

  const columns: GridColDef[] = [
    { field: 'applicant', headerName: 'Applicant', width: 150 },
    { field: 'waterRightNativeId', headerName: 'Application for', width: 150 },
    { field: 'applicationDisplayId', headerName: 'Application ID', width: 150 },
    {
      field: 'applicationSubmittedDate',
      headerName: 'Date Submitted',
      width: 150,
      valueFormatter: (value: Date) => {
        return moment(value).format('MM/DD/YYYY');
      },
    },
    { field: 'requestedFunding', headerName: 'Requested Funding', width: 150 },
    { field: 'waterRightState', headerName: 'State', width: 150 },
    { field: 'fundingOrganization', headerName: 'Funding Organization', width: 150 },
    { field: 'applicationStatus', headerName: 'Status', width: 150 },
  ];

  const rows: GridRowsProp =
    organizationsList?.applications.map((app: ApplicationDashboardListItem) => {
      return {
        id: app.applicationId,
        applicant: app.applicantFullName,
        waterRightNativeId: app.waterRightNativeId,
        applicationDisplayId: app.applicationDisplayId,
        applicationSubmittedDate: app.submittedDate,
        // TODO: JN - is this always per year?
        requestedFunding: `${app.compensationRateDollars}/${formatCompensationRateUnitsText(app.compensationRateUnits)}/year`,
        waterRightState: app.waterRightState,
        fundingOrganization: app.organizationName,
        applicationStatus: formatConservationApplicationStatusText(app.status),
      };
    }) ?? [];

  return (
    <div>
      <h1>Organization Dashboard</h1>
      <TableLoading isLoading={isLoading} isErrored={isError}>
        <DataGrid rows={rows} columns={columns}></DataGrid>
      </TableLoading>
    </div>
  );
}

export interface OrganizationDashboardApplicationTableListItem {
  id: string;
  applicant: string;
  waterRightNativeId: string;
  applicationDisplayId: string;
  applicationSubmittedDate: Date;
  requestedFunding: string;
  waterRightState: string;
  fundingOrganization: string;
  applicationStatus: string;
}
