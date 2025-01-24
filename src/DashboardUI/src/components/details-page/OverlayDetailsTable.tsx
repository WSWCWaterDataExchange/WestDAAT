import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { WaterRightsInfoListItem } from '../../data-contracts';

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

interface OverlayDetailsTableProps {
  waterRightsInfoList: WaterRightsInfoListItem[] | undefined;
}

export default function OverlayDetailsTable(props: OverlayDetailsTableProps) {
  const { waterRightsInfoList } = props;

  const rows = (waterRightsInfoList ?? []).map((entry) => ({
    id: entry.waDEOverlayUuid,
    ...entry,
  }));

  const columns: GridColDef[] = [
    { field: 'waDEOverlayUuid', headerName: 'WaDE Overlay UUID', flex: 1, sortable: true },
    { field: 'overlayNativeID', headerName: 'Overlay Native ID', flex: 1, sortable: true },
    { field: 'overlayName', headerName: 'Overlay Name', flex: 1, sortable: true },
    { field: 'overlayType', headerName: 'Overlay Type', flex: 1, sortable: true },
    { field: 'waterSourceType', headerName: 'Water Source Type', flex: 1, sortable: true },
    { field: 'overlayStatus', headerName: 'Overlay Status', flex: 1, sortable: true },
    {
      field: 'statuteLink',
      headerName: 'Statute Link',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const link = params.value as string;
        return link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          '-'
        );
      },
    },
    {
      field: 'statutoryEffectiveDate',
      headerName: 'Statutory Effective Date',
      flex: 1,
      sortable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString();
      },
    },
    {
      field: 'statutoryEndDate',
      headerName: 'Statutory End Date',
      flex: 1,
      sortable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString();
      },
    },
    {
      field: 'overlayStatusDesc',
      headerName: 'Overlay Statute Description',
      flex: 2,
      sortable: false,
    },
  ];

  return (
    <div style={{ width: '100%', height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        slots={{
          toolbar: QuickSearchToolbar,
        }}
      />
    </div>
  );
}
