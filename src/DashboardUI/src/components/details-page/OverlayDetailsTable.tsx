import React from 'react';
import Table from 'react-bootstrap/esm/Table';
import { WaterRightsInfoListItem } from '../../data-contracts';

interface OverlayDetailsTableProps {
  waterRightsInfoList: WaterRightsInfoListItem[] | undefined;
}

function OverlayDetailsTable(props: OverlayDetailsTableProps) {
  const { waterRightsInfoList } = props;

  return (
    <Table hover>
      <thead>
        <tr>
          <th>WaDE Overlay UUID</th>
          <th>Overlay Native ID</th>
          <th>Overlay Name</th>
          <th>Overlay Type</th>
          <th>Water Source Type</th>
          <th>Overlay Status</th>
          <th>Statute Link</th>
          <th>Statutory Effective Date</th>
          <th>Statutory End Date</th>
          <th>Overlay Statue Description</th>
        </tr>
      </thead>
      <tbody>
        {(waterRightsInfoList?.length ?? 0) === 0 && (
          <tr>
            <td colSpan={10} className="text-center">
              No data available
            </td>
          </tr>
        )}
        {waterRightsInfoList?.map((entry) => (
          <tr key={entry.waDEOverlayUuid}>
            <td>{entry.waDEOverlayUuid}</td>
            <td>{entry.overlayNativeID}</td>
            <td>{entry.overlayName}</td>
            <td>{entry.overlayType}</td>
            <td>{entry.waterSourceType}</td>
            <td>{entry.overlayStatus}</td>
            <td>
              <a href={entry.statuteLink} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            </td>
            <td>{entry.statutoryEffectiveDate ? new Date(entry.statutoryEffectiveDate).toLocaleDateString() : '-'}</td>
            <td>{entry.statutoryEndDate ? new Date(entry.statutoryEndDate).toLocaleDateString() : '-'}</td>
            <td>{entry.overlayStatusDesc}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default OverlayDetailsTable;
