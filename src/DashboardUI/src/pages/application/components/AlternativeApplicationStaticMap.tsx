import mapboxgl from 'mapbox-gl';
import { useEffect, useMemo, useState } from 'react';
import { MapStyle } from '../../../contexts/MapProvider';

import '../../../../src/components/map/map.scss';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import {
  fromPartialPointDataToPointFeature,
  fromPartialPolygonDataToPolygonFeature,
} from '../../../utilities/mapUtility';
import { Feature, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';

export function AlternativeApplicationStaticMap() {
  const { state } = useConservationApplicationContext();

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || '';
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/' + MapStyle.Satellite,
      center: [-100, 40],
      zoom: 4,
      interactive: false,
    });
    mapInstance.resize();

    mapInstance.once('style.load', () => {
      mapInstance.addSource('frozen-features', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      mapInstance.addLayer({
        id: 'frozen-features-polygons-fill-layer',
        type: 'fill',
        source: 'frozen-features',
        paint: {
          'fill-color': '#3bb2d0',
          'fill-opacity': 0.25,
        },
      });

      mapInstance.addLayer({
        id: 'frozen-features-polygons-border-layer',
        type: 'line',
        source: 'frozen-features',
        paint: {
          'line-color': '#3bb2d0',
          'line-width': 2,
        },
      });

      mapInstance.addLayer({
        id: 'frozen-features-points-layer',
        type: 'circle',
        source: 'frozen-features',
        filter: ['==', '$type', 'Point'], // only render Point data
        paint: {
          'circle-radius': 6,
          'circle-color': '#3bb2d0',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });
    });

    setMap(mapInstance);
  }, [setMap]);

  const polygons: Feature<Polygon, GeoJsonProperties>[] = useMemo(() => {
    return state.conservationApplication.estimateLocations.map(fromPartialPolygonDataToPolygonFeature);
  }, [state.conservationApplication.estimateLocations]);

  const controlLocation: Feature<Point, GeoJsonProperties> | undefined = useMemo(() => {
    if (!state.conservationApplication.controlLocation) {
      return undefined;
    }
    return fromPartialPointDataToPointFeature(state.conservationApplication.controlLocation);
  }, [state.conservationApplication.controlLocation]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const allFeatures: Feature<Geometry, GeoJsonProperties>[] = [
      ...(polygons as Feature<Geometry, GeoJsonProperties>[]),
      ...(controlLocation ? [controlLocation] : []),
    ];
    if (allFeatures.length === 0) {
      return;
    }

    function addFeaturesToMap() {
      const source = map!.getSource('frozen-features') as mapboxgl.GeoJSONSource | undefined;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: allFeatures,
        });

        const bounds = new mapboxgl.LngLatBounds();
        allFeatures.forEach((feature) => {
          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord as [number, number]);
            });
          } else if (feature.geometry.type === 'Point') {
            bounds.extend(feature.geometry.coordinates as [number, number]);
          }
        });

        map!.fitBounds(bounds, {
          padding: 25,
          maxZoom: 16,
          duration: 0,
        });
      } else {
        // Try again once source becomes available
        map!.once('sourcedata', addFeaturesToMap);
      }
    }

    if (map.isStyleLoaded()) {
      addFeaturesToMap();
    } else {
      map.once('style.load', addFeaturesToMap);
    }
  }, [map, polygons, controlLocation]);

  return (
    <div className="position-relative h-100" style={{ width: '600px', height: '400px' }}>
      <div id="map" className="map h-100"></div>
    </div>
  );
}
