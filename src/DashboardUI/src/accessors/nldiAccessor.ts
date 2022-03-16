import axios from "axios";
import * as geojson from "geojson";
import { Directions, DataPoints } from "../data-contracts/nldi";

export const getNldiFeatures = async (latitude: number, longitude: number, directions: Directions, dataPoints: DataPoints): Promise<geojson.FeatureCollection> => {
  const url = new URL(`api/NldiFeatures/@${latitude},${longitude}`, process.env.REACT_APP_WEBAPI_URL);
  url.searchParams.append("dir", directions.toString());
  url.searchParams.append("points", dataPoints.toString());
  const { data } = await axios.get<geojson.FeatureCollection>(
    url.toString()
  );
  return data;
};