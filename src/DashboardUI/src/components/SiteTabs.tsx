import { Tab, Table, Tabs } from 'react-bootstrap';
import { useWaterSiteSourceInfoList, useWaterRightInfoList } from '../hooks/useSiteQuery';

interface siteTabsProps {
    siteUuid: string;
}

function SiteTabs(props: siteTabsProps) {
    const waterSourceInfoList = useWaterSiteSourceInfoList(props.siteUuid).data;
    const waterRightInfoList = useWaterRightInfoList(props.siteUuid).data;

    return (
        <>
            <Tabs defaultActiveKey="source" id="uncontrolled-tab-example" className="mb-3">
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
                            {waterSourceInfoList?.map((source) =>
                                <tr key={source.waterSourceUuid}>
                                    <td>{source.waterSourceUuid}</td>
                                    <td>{source.waterSourceNativeId}</td>
                                    <td>{source.waterSourceName}</td>
                                    <td>{source.waterSourceType}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="right" title="Water Right Information">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>WaDE Water Right ID</th>
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
                            {waterSourceInfoList?.map((source) =>
                                <tr key={source.waterSourceUuid}>
                                    <td>{source.waterSourceUuid}</td>
                                    <td>{source.waterSourceNativeId}</td>
                                    <td>{source.waterSourceName}</td>
                                    <td>{source.waterSourceType}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </>
    )
}

export default SiteTabs;