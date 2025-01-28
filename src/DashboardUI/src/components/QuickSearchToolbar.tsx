import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default QuickSearchToolbar;
