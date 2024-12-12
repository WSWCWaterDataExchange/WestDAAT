import React from 'react';
import { Tab, Table, Tabs } from 'react-bootstrap';
import { FormattedDate } from '../../FormattedDate';
import { useSiteDetailsContext } from './Provider';
import { SiteActiveTabType } from './enums/SiteActiveTabType';

function SiteTabs() {
  const {
    activeTab,
    setActiveTab,
    hostData: {
      sourceInfoListQuery: { data: sourceInfoList },
      waterRightInfoListQuery: { data: waterRightInfoList },
      variableInfoListQuery: { data: variableInfoList },
      methodInfoListQuery: { data: methodInfoList },
    },
  } = useSiteDetailsContext();

  const getFormattedBeneficialUses = (beneficialUses: string[]) => {
    return beneficialUses.map((use) => (use !== beneficialUses[beneficialUses.length - 1] ? `${use}, ` : use));
  };

  return (
    <>
      <Tabs
        onSelect={(a) => {
          setActiveTab(a ? (a as SiteActiveTabType) : SiteActiveTabType.source);
        }}
        activeKey={activeTab}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey={SiteActiveTabType.source} title="Water Source Information">
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
        <Tab eventKey={SiteActiveTabType.right} title="Water Right Information">
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
                    <a href={`/details/right/${right.allocationUuid}`} target="_blank" rel="noopener noreferrer">
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
        <Tab eventKey={SiteActiveTabType.method} title="Method Information">
          <Table hover>
            <thead>
              <tr>
                <th>WaDE Method UUID</th>
                <th>Application Resource Type</th>
                <th>Method Type</th>
                <th>Method Link</th>
                <th>WaDE Data Mapping Process</th>
                <th>Method Description</th>
              </tr>
            </thead>
            <tbody>
              {methodInfoList?.map((method) => (
                <tr key={method.waDEMethodUuid}>
                  <td>{method.waDEMethodUuid}</td>
                  <td>{method.applicationResourceType}</td>
                  <td>{method.methodType}</td>
                  <td>
                    {method.methodUrl ? (
                      <a href={method.methodUrl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    ) : null}
                  </td>
                  <td>
                    {method.waDEDataMappingProcessUrl ? (
                      <a href={method.waDEDataMappingProcessUrl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    ) : null}
                  </td>
                  <td>{method.methodDescription}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey={SiteActiveTabType.variable} title="Variable Information">
          <Table hover>
            <thead>
              <tr>
                <th>WaDE Variable UUID</th>
                <th>Variable</th>
                <th>Variable Specific Type</th>
                <th>Amount Unit</th>
                <th>Aggregation Statistic</th>
                <th>Aggregation Interval</th>
                <th>Aggregation Interval Unit</th>
                <th>Report Year Start Month</th>
                <th>Report Year Type</th>
              </tr>
            </thead>
            <tbody>
              {variableInfoList?.map((variable) => (
                <tr key={variable.waDEVariableUuid}>
                  <td>{variable.waDEVariableUuid}</td>
                  <td>{variable.variable}</td>
                  <td>{variable.variableSpecificType}</td>
                  <td>{variable.amountUnit}</td>
                  <td>{variable.aggregationStatistic}</td>
                  <td>{variable.aggregationInterval}</td>
                  <td>{variable.aggregationIntervalUnit}</td>
                  <td>{variable.reportYearStartMonth}</td>
                  <td>{variable.reportYearType}</td>
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
