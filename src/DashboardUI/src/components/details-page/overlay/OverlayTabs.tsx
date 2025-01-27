import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useOverlayDetailsContext } from './Provider';
import OverlayDetailsTable from '../OverlayDetailsTable';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

export enum OverlayTab {
  Admin = 'overlay',
  WaterRight = 'right',
}

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function OverlayTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      overlayInfoListQuery: { data: overlayInfoList },
      waterRightsInfoListByReportingUnitQuery: { data: waterRightsInfoListByReportingUnit },
    },
  } = useOverlayDetailsContext();

  const waterRightRows = React.useMemo(() => {
    if (!overlayInfoList) return [];
    return overlayInfoList.map((entry) => ({
      id: entry.allocationUuid,
      ...entry,
    }));
  }, [overlayInfoList]);

  const waterRightColumns: GridColDef[] = [
    {
      field: 'allocationUuid',
      headerName: 'WaDE Water Right Identifier',
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => {
        const uuid = params.value as string;
        return (
          <a href={`/details/right/${uuid}`} target="_blank" rel="noopener noreferrer">
            {uuid}
          </a>
        );
      },
    },
    { field: 'waterRightNativeId', headerName: 'Water Right Native ID', flex: 1, sortable: true },
    { field: 'owner', headerName: 'Owner', flex: 1, sortable: true },
    {
      field: 'priorityDate',
      headerName: 'Priority Date',
      flex: 1,
      sortable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString();
      },
    },
    { field: 'flow', headerName: 'Flow (CFS)', flex: 1, sortable: true },
    { field: 'volume', headerName: 'Volume (AF)', flex: 1, sortable: true },
    { field: 'legalStatus', headerName: 'Legal Status', flex: 1, sortable: true },
    {
      field: 'expirationDate',
      headerName: 'Expiration Date',
      flex: 1,
      sortable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString();
      },
    },
    {
      field: 'beneficialUses',
      headerName: 'Beneficial Uses',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const uses = params.value as string[] | undefined;
        return uses?.length ? uses.join(', ') : '-';
      },
    },
  ];

  return (
    <Tabs
      id="overlay-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key as OverlayTab)}
      className="mb-3 custom-tabs"
    >
      <Tab eventKey={OverlayTab.Admin} title="Administrative/Regulatory Overlay Info">
        <OverlayDetailsTable waterRightsInfoList={waterRightsInfoListByReportingUnit} />
      </Tab>

      <Tab eventKey={OverlayTab.WaterRight} title="Related Water Right Information">
        <div style={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={waterRightRows}
            columns={waterRightColumns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
            slots={{
              toolbar: QuickSearchToolbar,
            }}
          />
        </div>
      </Tab>
    </Tabs>
  );
}

export default OverlayTabs;
