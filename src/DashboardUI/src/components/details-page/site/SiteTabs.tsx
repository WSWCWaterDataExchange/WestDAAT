import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { FormattedDate } from '../../FormattedDate';
import { useSiteDetailsContext } from './Provider';
import { SiteActiveTabType } from './enums/SiteActiveTabType';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import QuickSearchToolbar from '../../QuickSearchToolbar';

function getFormattedBeneficialUses(beneficialUses: string[]): string {
  return beneficialUses.join(', ');
}

export default function SiteTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      sourceInfoListQuery: { data: sourceInfoList },
      waterRightInfoListQuery: { data: waterRightInfoList },
      variableInfoListQuery: { data: variableInfoList },
      methodInfoListQuery: { data: methodInfoList },
      timeSeriesInfoListQuery: { data: timeSeriesInfoList },
    },
  } = useSiteDetailsContext();

  const waterSourceRows = React.useMemo(() => {
    if (!sourceInfoList) return [];
    return sourceInfoList.map((src) => ({
      id: src.waterSourceUuid,
      ...src,
    }));
  }, [sourceInfoList]);

  const waterSourceColumns: GridColDef[] = [
    { field: 'waterSourceUuid', headerName: 'WaDE Water Source ID', flex: 1, sortable: true },
    { field: 'waterSourceNativeId', headerName: 'Water Source Native ID', flex: 1, sortable: true },
    { field: 'waterSourceName', headerName: 'Water Source Name', flex: 1, sortable: true },
    { field: 'waterSourceType', headerName: 'Water Source Type', flex: 1, sortable: true },
  ];

  const timeSeriesRows = React.useMemo(() => {
    if (!timeSeriesInfoList) return [];
    return timeSeriesInfoList.map((ts) => ({
      id: ts.waDEVariableUuid,
      ...ts,
    }));
  }, [timeSeriesInfoList]);

  const timeSeriesColumns: GridColDef[] = [
    { field: 'waDEVariableUuid', headerName: 'WaDE Variable UUID', flex: 1, sortable: true },
    { field: 'waDEMethodUuid', headerName: 'WaDE Method UUID', flex: 1, sortable: true },
    { field: 'waDEWaterSourceUuid', headerName: 'WaDE Water Source UUID', flex: 1, sortable: true },
    {
      field: 'timeframeStart',
      headerName: 'Timeframe Start',
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <FormattedDate>{params.value}</FormattedDate>,
    },
    {
      field: 'timeframeEnd',
      headerName: 'Timeframe End',
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <FormattedDate>{params.value}</FormattedDate>,
    },
    { field: 'reportYear', headerName: 'Report Year', flex: 1, sortable: true },
    { field: 'amount', headerName: 'Amount', flex: 1, sortable: true },
    { field: 'beneficialUse', headerName: 'Beneficial Use', flex: 1, sortable: true },
    { field: 'populationServed', headerName: 'Population Served', flex: 1, sortable: true },
    { field: 'cropDutyAmount', headerName: 'Crop Duty Amount', flex: 1, sortable: true },
    { field: 'communityWaterSupplySystem', headerName: 'Community Water Supply System', flex: 1, sortable: true },
  ];

  const waterRightRows = React.useMemo(() => {
    if (!waterRightInfoList) return [];
    return waterRightInfoList.map((right) => ({
      id: right.allocationUuid,
      ...right,
    }));
  }, [waterRightInfoList]);

  const waterRightColumns: GridColDef[] = [
    {
      field: 'allocationUuid',
      headerName: 'WaDE Water Right Identifier',
      flex: 1,
      sortable: true,
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
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.value as string | undefined;
        return dateValue ? <FormattedDate>{dateValue}</FormattedDate> : '-';
      },
    },
    {
      field: 'expirationDate',
      headerName: 'Expiration Date',
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.value as string | undefined;
        return dateValue ? <FormattedDate>{dateValue}</FormattedDate> : '-';
      },
    },
    { field: 'legalStatus', headerName: 'Legal Status', flex: 1, sortable: true },
    { field: 'flow', headerName: 'Flow (CFS)', flex: 1, sortable: true },
    { field: 'volume', headerName: 'Volume (AF)', flex: 1, sortable: true },
    {
      field: 'beneficialUses',
      headerName: 'Beneficial Use',
      flex: 2,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const uses = params.value as string[] | undefined;
        if (!uses || uses.length === 0) return '-';
        return getFormattedBeneficialUses(uses);
      },
    },
  ];

  const methodRows = React.useMemo(() => {
    if (!methodInfoList) return [];
    return methodInfoList.map((m) => ({
      id: m.waDEMethodUuid,
      ...m,
    }));
  }, [methodInfoList]);

  const methodColumns: GridColDef[] = [
    { field: 'waDEMethodUuid', headerName: 'WaDE Method UUID', flex: 1, sortable: true },
    { field: 'applicationResourceType', headerName: 'Application Resource Type', flex: 1, sortable: true },
    { field: 'methodType', headerName: 'Method Type', flex: 1, sortable: true },
    {
      field: 'methodUrl',
      headerName: 'Method Link',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const url = params.value as string | undefined;
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : null;
      },
    },
    {
      field: 'waDEDataMappingProcessUrl',
      headerName: 'WaDE Data Mapping Process',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const url = params.value as string | undefined;
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : null;
      },
    },
    { field: 'methodDescription', headerName: 'Method Description', flex: 2, sortable: false },
  ];

  const variableRows = React.useMemo(() => {
    if (!variableInfoList) return [];
    return variableInfoList.map((v) => ({
      id: v.waDEVariableUuid,
      ...v,
    }));
  }, [variableInfoList]);

  const variableColumns: GridColDef[] = [
    { field: 'waDEVariableUuid', headerName: 'WaDE Variable UUID', flex: 1, sortable: true },
    { field: 'variable', headerName: 'Variable', flex: 1, sortable: true },
    { field: 'variableSpecificType', headerName: 'Variable Specific Type', flex: 1, sortable: true },
    { field: 'amountUnit', headerName: 'Amount Unit', flex: 1, sortable: true },
    { field: 'aggregationStatistic', headerName: 'Aggregation Statistic', flex: 1, sortable: true },
    { field: 'aggregationInterval', headerName: 'Aggregation Interval', flex: 1, sortable: true },
    { field: 'aggregationIntervalUnit', headerName: 'Aggregation Interval Unit', flex: 1, sortable: true },
    { field: 'reportYearStartMonth', headerName: 'Report Year Start Month', flex: 1, sortable: true },
    { field: 'reportYearType', headerName: 'Report Year Type', flex: 1, sortable: true },
  ];

  const handleSelect = (key: string | null) => {
    setActiveTab(key ? (key as SiteActiveTabType) : SiteActiveTabType.source);
  };

  return (
    <>
      <Tabs onSelect={handleSelect} activeKey={activeTab} className="mb-3 custom-tabs">
        <Tab eventKey={SiteActiveTabType.source} title="Water Source Information">
          <div style={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={waterSourceRows}
              columns={waterSourceColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
              slots={{ toolbar: QuickSearchToolbar }}
            />
          </div>
        </Tab>

        <Tab eventKey={SiteActiveTabType.right} title="Water Right Information">
          <div style={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={waterRightRows}
              columns={waterRightColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
              slots={{ toolbar: QuickSearchToolbar }}
            />
          </div>
        </Tab>

        <Tab eventKey={SiteActiveTabType.method} title="Method Information">
          <div style={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={methodRows}
              columns={methodColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
              slots={{ toolbar: QuickSearchToolbar }}
            />
          </div>
        </Tab>

        <Tab eventKey={SiteActiveTabType.variable} title="Variable Information">
          <div style={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={variableRows}
              columns={variableColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
              slots={{ toolbar: QuickSearchToolbar }}
            />
          </div>
        </Tab>

        <Tab eventKey={SiteActiveTabType.timeSeries} title="Time Series Information">
          <div style={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={timeSeriesRows}
              columns={timeSeriesColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
              slots={{ toolbar: QuickSearchToolbar }}
            />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
