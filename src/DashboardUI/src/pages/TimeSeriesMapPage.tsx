import TimeFullMap from "../components/details-page/timeseries/time-series-map/TimeFullMap";
import { HomePageProvider } from "../components/home-page/Provider";
import Layout from "./Layout";



function TimeSeriesMapPage(){

    return(
        <div>
            <h2>Non-Federal Streamgage, Reservoir, Groundwater Well Time Series Data</h2>
            <TimeFullMap/>
        </div>

    )

}
export default TimeSeriesMapPage;