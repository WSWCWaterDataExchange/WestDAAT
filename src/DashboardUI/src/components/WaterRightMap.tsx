import { useContext, useEffect } from "react";
import Map from './Map';
import { MapContext } from './MapProvider';
import { useWaterRightSiteLocations } from '../hooks/waterAllocation';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';

interface waterRightMapProps {
  waterRightId: string;
}

function WaterRightMap(props: waterRightMapProps){
  const waterRightSiteLocations = useWaterRightSiteLocations(+props.waterRightId).data;

  const {
    setVisibleLayers, 
    setGeoJsonData,
    setMapBounds
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers(["site-locations", "site-locations-label"]);
  }, [setVisibleLayers])

  useEffect(() => {
    if(waterRightSiteLocations){
      var features : GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] = [];
      waterRightSiteLocations.forEach(x => {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [x.longitude, x.latitude]
          },
          properties: {
            "siteUuid": x.siteUuid,
          }
        })
      })

      var featureCollection : GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: features
      };

      setGeoJsonData("site-locations", featureCollection);
    }
  }, [waterRightSiteLocations, setGeoJsonData])

  useEffect(() => {
    const mapBounds: mapboxgl.LngLatLike[] = [];
    waterRightSiteLocations?.forEach(x => {
      mapBounds.push(new mapboxgl.LngLat(x.longitude, x.latitude))
    })

    setMapBounds(mapBounds)
  }, [waterRightSiteLocations, setMapBounds])

  return (
    <Map />
  )
}

export default WaterRightMap;