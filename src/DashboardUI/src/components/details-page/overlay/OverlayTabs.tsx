import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useOverlayDetailsContext } from './Provider';
import OverlayDetailsTable from '../OverlayDetailsTable';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import QuickSearchToolbar from '../../QuickSearchToolbar';

export enum OverlayTab {
  Admin = 'overlay',
  WaterRight = 'right',
}

function OverlayTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      waterRightInfoListQuery: { data: waterRightInfoList },
      overlayInfoListQuery: { data: overlayInfoList },
    },
  } = useOverlayDetailsContext();

  const waterRightRows = React.useMemo(() => {
    if (!waterRightInfoList) return [];
    return waterRightInfoList.map((entry) => ({
      id: entry.allocationUuid,
      ...entry,
    }));
  }, [waterRightInfoList]);

  const waterRightColumns: GridColDef[] = [
    {
      field: 'allocationUuid',
      headerName: 'Allocation UUID',
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
        <OverlayDetailsTable overlayInfoList={overlayInfoList} />
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
