import React from 'react';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { useOverlayDetailsContext } from './Provider';
import OverlayDetailsTable from '../OverlayDetailsTable';

export enum OverlayTab {
  Admin = 'overlay',
  WaterRight = 'right',
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
                <td>{entry.priorityDate ? new Date(entry.priorityDate).toLocaleDateString() : '-'}</td>
                <td>{entry.flow ?? '-'}</td>
                <td>{entry.volume ?? '-'}</td>
                <td>{entry.legalStatus}</td>
                <td>{entry.expirationDate ? new Date(entry.expirationDate).toLocaleDateString() : '-'}</td>
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
