import { HomePageProvider } from '../components/ssro-timeseries-page/ssro-Provider';
import { Layout } from '../components/ssro-timeseries-page/ssro-Layout';

function SSROTimeSeriesMapPage() {
  return (
    <div className='SSROTimeSeriesMapPage'>
      <h1>SSRO Time Series Page</h1>
      <HomePageProvider>
        <Layout />
      </HomePageProvider>
    </div>
  )
}

export default SSROTimeSeriesMapPage;