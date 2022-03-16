import { useState } from 'react';
import { Tab, Table, Tabs } from 'react-bootstrap';
import { useWaterRightSiteInfoList, useWaterRightSourceInfoList } from '../hooks/waterAllocation';


interface waterRightTabsProps {
    waterRightId: string;
  }
export enum WaterRightTab{
    SiteInfo = 'SiteInfo',
    WaterRightInfo = 'WaterRightInfo'
}

function WaterRightTabs(props: waterRightTabsProps){

    const siteInfoList = useWaterRightSiteInfoList(+props.waterRightId).data;
    const sourceInfoList = useWaterRightSourceInfoList(+props.waterRightId).data;
    console.log("site info", siteInfoList);
    console.log("source info", sourceInfoList);

    return (
    <>
        <Tabs defaultActiveKey="site" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="site" title="Site Info">
                <Table hover>
                    <thead>
                        <tr>
                        <th>WaDE Site ID</th>
                        <th>Site Native ID</th>
                        <th>Site Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>County</th>
                        <th>Site Type</th>
                        <th>POD or POU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {siteInfoList?.map((site) =>
                            <tr>
                                <td>{site.siteUuid}</td>
                                <td>{site.siteNativeId}</td>
                                <td>{site.siteName}</td>
                                <td>{site.latitude}</td>
                                <td>{site.longitude}</td>
                                <td>{site.county}</td>
                                <td>{site.siteTypeCv}</td>
                                <td>{site.poDorPOUSite}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey="source" title="Water Source Info">
            <Table hover>
                    <thead>
                        <tr>
                        <th>WaDE Water Source ID</th>
                        <th>Water Source Native ID</th>
                        <th>Water Source Name</th>
                        <th>Water Source Type</th>
                        <th>GNIS ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sourceInfoList?.map((source) =>
                            <tr>
                                <td>{source.waterSourceUuid}</td>
                                <td>{source.waterSourceNativeId}</td>
                                <td>{source.waterSourceName}</td>
                                <td>{source.waterSourceTypeCv}</td>
                                <td>{source.gnisfeatureNameCv}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Tab>
        </Tabs>
    </>
        )
}

export default WaterRightTabs;