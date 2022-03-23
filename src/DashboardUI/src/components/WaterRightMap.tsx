import { useContext, useEffect } from "react";
import Map from './Map';
import { MapContext } from './MapProvider';
import { useWaterRightSiteLocations } from '../hooks/waterAllocation';
import mapboxgl from 'mapbox-gl';
import useProgressIndicator from '../hooks/useProgressIndicator';
import { getWaterRightSiteLocations } from '../accessors/waterAllocationAccessor';
import { useQuery } from 'react-query';

interface waterRightMapProps {
  waterRightId: string;
}

function WaterRightMap(props: waterRightMapProps){
  const { data: waterRightSiteLocations, isFetching: isWaterRightSiteLocationsLoading } = useQuery(
    ['waterRightSiteLocations', +props.waterRightId], 
    () => getWaterRightSiteLocations(+props.waterRightId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    })

  const {
    setVisibleLayers, 
    setGeoJsonData,
    setMapBoundSettings: setMapBounds
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers(["site-locations", "site-locations-label"]);
  }, [setVisibleLayers])

  useEffect(() => {
    if(waterRightSiteLocations){
      setGeoJsonData("site-locations", waterRightSiteLocations);
    }
  }, [waterRightSiteLocations, setGeoJsonData])

  useEffect(() => {
    const mapBounds: mapboxgl.LngLatLike[] = [];
    waterRightSiteLocations?.features.forEach(x => {
      // TODO: Update this method to account for polygons when they are added.
      if(x.geometry.type === 'Point'){
        const coordinates = x.geometry.coordinates;
        mapBounds.push(new mapboxgl.LngLat(coordinates[0], coordinates[1]))
      }
    })

    setMapBounds({
      LngLatBounds: mapBounds,
      maxZoom: 10, 
      padding: 50
    })
  }, [waterRightSiteLocations, setMapBounds])

  useProgressIndicator([!isWaterRightSiteLocationsLoading], "Loading Map Data");

  if(isWaterRightSiteLocationsLoading) return null;

  return (
    <Map />
  )
}

export default WaterRightMap;