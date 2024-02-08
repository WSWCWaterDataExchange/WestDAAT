import { SiteSpecificPageProvider } from "../components/ssro-timeseries-page/ssro-Provider";
import { Layout } from "../components/ssro-timeseries-page/ssro-Layout";

export enum SiteSpecificROTab {
  SiteSpecific = "Site Specific RO Data",
}

function SiteSpecificROPage() {
  return (
    <div className="SSROTimeSeriesMapPage">
      <h1>SSRO Time Series Page</h1>
      <SiteSpecificPageProvider>
        <Layout />
      </SiteSpecificPageProvider>
    </div>
  );
}

export default SiteSpecificROPage;
