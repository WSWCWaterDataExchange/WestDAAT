import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APISearch from "../components/details-page/timeseries/APISearch";
import TimeSeriesProperties from "../components/details-page/timeseries/TimeSeriesProperties";
import TimeSeriesTabs from "../components/details-page/timeseries/TimeSeriesTabs";
import "../components/details-page/timeseries/time.scss";
import { DetailsPage } from "../components/details-page/DetailsPageLayout";
import { SiteUUIDContext } from "../components/details-page/timeseries/Context/SiteUUIDContext";

function TimeSeriesPage() {
  const contextValue = useContext(SiteUUIDContext);
  const { setStoredSiteUUID } = contextValue || {};
  const { siteUUID } = useParams<{ siteUUID: string }>();

  useEffect(() => {
    // Set the SiteUUID in the context when the component mounts
    if (setStoredSiteUUID && siteUUID) {
      setStoredSiteUUID(siteUUID);
    }
  }, [siteUUID, setStoredSiteUUID]);

  const [apiData, setApiData] = useState<any>(null);

  const handleApiDataFetched = (data: any) => {
    setApiData(data);
  };

  return (
    <div className="time-series-page">
      <DetailsPage.Header>Time Series Data Landing Page</DetailsPage.Header>
      <APISearch onApiDataFetched={handleApiDataFetched} />
      <TimeSeriesProperties apiData={apiData} />
      <TimeSeriesTabs apiData={apiData} />
    </div>
  );
}

export default TimeSeriesPage;
