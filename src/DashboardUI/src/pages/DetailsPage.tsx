import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../styles/detail-page.scss';
import WaterRightMap from '../components/WaterRightMap';
import WaterRightProperties from '../components/WaterRightProperties';
import WaterRightTabs from '../components/WaterRightTabs';
import SiteMap from '../components/SiteMap';
import SiteProperties from '../components/SiteProperties';
import SiteTabs from '../components/SiteTabs';

interface detailPageProps {
  detailType: string;
}

function DetailsPage(props: detailPageProps) {

  let { id } = useParams();

  const isSiteDetail = props.detailType === "site";

  const detailsComponent = isSiteDetail ? <SiteProperties /> : <WaterRightProperties waterRightId={id ? id : ""}/>;
  const mapComponent = isSiteDetail ? <SiteMap /> : <WaterRightMap/>;
  const tabComponent = isSiteDetail ? <SiteTabs /> : <WaterRightTabs/>;

    return (
      <>
      <div className="detail-page d-flex flex-column">
        <div className='d-flex flex-row align-items-center title-header'>
          <span className='d-flex me-auto'>WaDE {isSiteDetail ? "Site" : "Right"} ID: {id} </span>
          <div className='p-2'>
            <Button variant="secondary" size="sm">Return to Map</Button>
          </div>
          <div className='p-2'>
            <Button size="sm">Download Data</Button>
          </div>
        </div>
        <div className='d-flex flex-row'>
          <div className='me-auto'>
            {detailsComponent}
          </div>
          <div className=''>
            {mapComponent}
          </div>
        </div>
        <div className='flex-fill'>
          {tabComponent}
        </div>
      </div>
      </>
    );
  }
  
  export default DetailsPage;
  