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
import { ExtendedMapboxDraw } from '../../../components/map/ExtendedMapboxDraw';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export function AlternativeApplicationStaticMap() {
  const { state } = useConservationApplicationContext();

  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [drawControl, setDrawControl] = useState<ExtendedMapboxDraw | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || '';
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/' + MapStyle.Satellite,
      center: [-100, 40],
      zoom: 4,
      interactive: false,
    });

    const dc = new ExtendedMapboxDraw({
      props: {
        displayControlsDefault: false,
        controls: {},
        modes: {
          ...MapboxDraw.modes,
        },
      },
      buttons: [],
    });

    mapInstance.addControl(dc);
    setDrawControl(dc);

    mapInstance.resize();
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
    if (!map || !drawControl) {
      return;
    }

    drawControl.deleteAll();

    polygons.forEach(drawControl.add);
    if (controlLocation) {
      drawControl.add(controlLocation);
    }

    const allFeatures: Feature<Geometry, GeoJsonProperties>[] = [
      ...(polygons as Feature<Geometry, GeoJsonProperties>[]),
    ].concat(controlLocation ? [controlLocation] : []);

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

    map.fitBounds(bounds, {
      padding: 25,
      maxZoom: 16,
      duration: 0,
    });
  }, [map, drawControl, polygons, controlLocation]);

  return (
    <div className="position-relative h-100" style={{ width: '600px', height: '400px' }}>
      <div id="map" className="map h-100"></div>
    </div>
  );
}
