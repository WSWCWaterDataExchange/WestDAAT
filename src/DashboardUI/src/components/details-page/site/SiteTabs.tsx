import React from 'react';
import { Tab, Table, Tabs } from 'react-bootstrap';
import { FormattedDate } from '../../FormattedDate';
import { useSiteDetailsContext } from './Provider';

function SiteTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      sourceInfoListQuery: { data: sourceInfoList },
      waterRightInfoListQuery: { data: waterRightInfoList },
    },
  } = useSiteDetailsContext();

  const getFormattedBeneficialUses = (beneficialUses: string[]) => {
    return beneficialUses.map((use) =>
      use !== beneficialUses[beneficialUses.length - 1] ? `${use}, ` : use,
    );
  };

  return (
    <>
      <Tabs
        onSelect={(a) => setActiveTab(a === 'right' ? a : 'source')}
        activeKey={activeTab}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="source" title="Water Source Information">
          <Table hover>
            <thead>
              <tr>
                <th>WaDE Water Source ID</th>
                <th>Water Source Native ID</th>
                <th>Water Source Name</th>
                <th>Water Source Type</th>
              </tr>
            </thead>
            <tbody>
              {sourceInfoList?.map((source) => (
                <tr key={source.waterSourceUuid}>
                  <td>{source.waterSourceUuid}</td>
                  <td>{source.waterSourceNativeId}</td>
                  <td>{source.waterSourceName}</td>
                  <td>{source.waterSourceType}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="right" title="Water Right Information">
          <Table hover>
            <thead>
              <tr>
                <th>WaDE Water Right Identifier</th>
                <th>Water Right Native ID</th>
                <th>Owner</th>
                <th>Priority Date</th>
                <th>Expiration Date</th>
                <th>Legal Status</th>
                <th>Flow (CFS)</th>
                <th>Volume (AF)</th>
                <th>Beneficial Use</th>
              </tr>
            </thead>
            <tbody>
              {waterRightInfoList?.map((right) => (
                <tr key={right.allocationUuid}>
                  <td>
                    <a
                      href={`/details/right/${right.allocationUuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {right.allocationUuid}
                    </a>
                  </td>
                  <td>{right.waterRightNativeId}</td>
                  <td>{right.owner}</td>
                  <td>
                    <FormattedDate>{right.priorityDate}</FormattedDate>
                  </td>
                  <td>
                    <FormattedDate>{right.expirationDate}</FormattedDate>
                  </td>
                  <td>{right.legalStatus}</td>
                  <td>{right.flow}</td>
                  <td>{right.volume}</td>
                  <td>{getFormattedBeneficialUses(right.beneficialUses)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </>
  );
}

export default SiteTabs;
