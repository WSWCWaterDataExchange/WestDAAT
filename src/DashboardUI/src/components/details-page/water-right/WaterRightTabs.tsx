import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ActiveTabType, useWaterRightDetailsContext } from './Provider';
import OverlayDetailsTable from '../OverlayDetailsTable';
import QuickSearchToolbar from '../../QuickSearchToolbar';

export default function WaterRightTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      siteInfoListQuery: { data: siteInfoList },
      sourceInfoListQuery: { data: sourceInfoList },
      waterRightsInfoListQuery: { data: waterRightsInfoList },
    },
  } = useWaterRightDetailsContext();

  const siteRows = React.useMemo(() => {
    if (!siteInfoList) return [];
    return siteInfoList.map((site, index) => ({
      id: `site-${site.siteUuid}-${index}`,
      ...site,
    }));
  }, [siteInfoList]);

  const siteColumns: GridColDef[] = [
    {
      field: 'siteUuid',
      headerName: 'WaDE Site ID',
      flex: 1,
      renderCell: (params) => (
        <a href={`/details/site/${params.value}`} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: 'siteNativeId', headerName: 'Site Native ID', flex: 1 },
    { field: 'siteName', headerName: 'Site Name', flex: 1 },
    { field: 'latitude', headerName: 'Latitude', flex: 1 },
    { field: 'longitude', headerName: 'Longitude', flex: 1 },
    { field: 'county', headerName: 'County', flex: 1 },
    { field: 'siteType', headerName: 'Site Type', flex: 1 },
    { field: 'poDorPOUSite', headerName: 'POD or POU', flex: 1 },
  ];

  const sourceRows = React.useMemo(() => {
    if (!sourceInfoList) return [];
    return sourceInfoList.map((src, index) => ({
      id: `source-${src.waterSourceUuid}-${index}`,
      ...src,
    }));
  }, [sourceInfoList]);

  const sourceColumns: GridColDef[] = [
    { field: 'waterSourceUuid', headerName: 'WaDE Water Source ID', flex: 1 },
    { field: 'waterSourceNativeId', headerName: 'Water Source Native ID', flex: 1 },
    { field: 'waterSourceName', headerName: 'Water Source Name', flex: 1 },
    { field: 'waterSourceType', headerName: 'Water Source Type', flex: 1 },
    { field: 'gnisfeatureNameCv', headerName: 'GNIS ID', flex: 1 },
  ];

  return (
    <Tabs onSelect={(key) => setActiveTab(key as ActiveTabType)} activeKey={activeTab} className="mb-3 custom-tabs">
      <Tab eventKey="site" title="Site Info">
        <div style={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={siteRows}
            columns={siteColumns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
            slots={{
              toolbar: QuickSearchToolbar,
            }}
          />
        </div>
      </Tab>
      <Tab eventKey="source" title="Water Source Info">
        <div style={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={sourceRows}
            columns={sourceColumns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
            slots={{
              toolbar: QuickSearchToolbar,
            }}
          />
        </div>
      </Tab>
      <Tab eventKey="rights" title="Administrative/Regulatory Overlay Info">
        <OverlayDetailsTable waterRightsInfoList={waterRightsInfoList} />
      </Tab>
    </Tabs>
  );
}
