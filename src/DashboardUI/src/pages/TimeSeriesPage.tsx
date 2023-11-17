import { useState } from "react";
import APISearch from "../components/details-page/timeseries/APISearch";
import TimeSeriesProperties from "../components/details-page/timeseries/TimeSeriesProperties";
import TimeSeriesTabs from "../components/details-page/timeseries/TimeSeriesTabs";
import "../components/details-page/timeseries/time.scss";
import { DetailsPage } from "../components/details-page/DetailsPageLayout";
function TimeSeriesPage() {
  const [apiData, setApiData] = useState(null);

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
