import React from 'react';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { useOverlayDetailsContext } from './Provider';

export enum OverlayTab {
  Admin = 'admin',
  WaterRight = 'water-right',
}

function OverlayTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      overlayInfoListQuery: { data: overlayInfoList },
      waterRightsInfoListQuery: { data: waterRightsInfoList },
    },
  } = useOverlayDetailsContext();

  return (
    <Tabs
      id="overlay-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key as OverlayTab)}
      className="mb-3 custom-tabs"
    >
      <Tab eventKey={OverlayTab.Admin} title="Administrative/Regulatory Overlay Info">
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
              <td>
                {entry.statutoryEffectiveDate
                  ? new Date(entry.statutoryEffectiveDate).toLocaleDateString()
                  : '-'}
              </td>
              <td>
                {entry.statutoryEndDate
                  ? new Date(entry.statutoryEndDate).toLocaleDateString()
                  : '-'}
              </td>
              <td>{entry.overlayStatusDesc}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Tab>

      <Tab eventKey={OverlayTab.WaterRight} title="Related Water Right Information">
        <Table hover>
          <thead>
          <tr>
            <th>Allocation UUID</th>
            <th>Water Right Native ID</th>
            <th>Owner</th>
            <th>Priority Date</th>
            <th>Flow (CFS)</th>
            <th>Volume (AF)</th>
            <th>Legal Status</th>
            <th>Expiration Date</th>
            <th>Beneficial Uses</th>
          </tr>
          </thead>
          <tbody>
          {overlayInfoList?.map((entry) => (
            <tr key={entry.allocationUuid}>
              <td>{entry.allocationUuid}</td>
              <td>{entry.waterRightNativeId}</td>
              <td>{entry.owner}</td>
              <td>
                {entry.priorityDate
                  ? new Date(entry.priorityDate).toLocaleDateString()
                  : '-'}
              </td>
              <td>{entry.flow ?? '-'}</td>
              <td>{entry.volume ?? '-'}</td>
              <td>{entry.legalStatus}</td>
              <td>
                {entry.expirationDate
                  ? new Date(entry.expirationDate).toLocaleDateString()
                  : '-'}
              </td>
              <td>{entry.beneficialUses.join(', ')}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Tab>
    </Tabs>
  );
}

export default OverlayTabs;
