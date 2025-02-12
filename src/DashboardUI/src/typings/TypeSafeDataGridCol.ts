import { GridColDef, GridRowsProp } from "@mui/x-data-grid";

// TODO: JN - where should this live?
export type DataGridColumns<T> = GridColDef & { field: keyof T };

/**
 * This is a type-safe version of the DataGridRowsProp type from @mui/x-data-grid.
 * It requires that an id field is present for React to only render rows as necessary.
 */
export type DataGridRows<T> = GridRowsProp<{ id: string } & T>;