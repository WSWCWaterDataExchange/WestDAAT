import { Tab, Table, Tabs } from 'react-bootstrap';
import { useWaterSiteSourceInfoList } from '../hooks/useSiteQuery';

interface siteTabsProps {
    siteUuid: string;
}

export enum SiteTab {
    WaterSourceInfo = 'WaterSourceInfo',
}

function SiteTabs(props: siteTabsProps) {
    const waterSourceInfoList = useWaterSiteSourceInfoList(props.siteUuid).data;

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
            </Tabs>
        </>
    )
}

export default SiteTabs;