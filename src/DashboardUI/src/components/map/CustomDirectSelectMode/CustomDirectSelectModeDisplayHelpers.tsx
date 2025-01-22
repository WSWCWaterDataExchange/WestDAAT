import { Feature, GeoJsonProperties, Geometry, Position, GeoJSON } from 'geojson';
import { CustomDirectSelectModeState } from './CustomDirectSelectMode';

export const handleDisplayCircle = (
  state: CustomDirectSelectModeState,
  geojson: Feature<Geometry, GeoJsonProperties>,
  display: (geojson: GeoJSON) => void,
) => {
  // display the circle feature
  geojson.properties!.active = 'true';
  display(geojson);

  // render marker points manually rather than add them to the map's feature collection
  const draggableMarkerPositions = getCardinalDirectionCoordinatesOnFeature(state.feature!.getCoordinates()[0]);
  draggableMarkerPositions
    .map((position) => buildVertex(geojson.properties!.id, position))
    .forEach((vertex) => display(vertex));
};

export const handleDisplayRectangle = (
  state: CustomDirectSelectModeState,
  geojson: Feature<Geometry, GeoJsonProperties>,
  display: (geojson: GeoJSON) => void,
) => {
  // override rendering - default polygon tool displays midpoint markers which we don't want
  // display the rectangle feature
  geojson.properties!.active = 'true';
  display(geojson);

  // render marker points manually rather than add them to the map's feature collection
  const rectangle = state.feature!;
  const corners = rectangle.getCoordinates()[0];
  corners.map((position) => buildVertex(geojson.properties!.id, position)).forEach((vertex) => display(vertex));
};

const getCardinalDirectionCoordinatesOnFeature = (allCoordinateLngLatValues: Position[]): Position[] => {
  // technically this gets the coordinates that align *most closely* with the cardinal directions
  // but the distinction doesn't really matter for a circle containing a sufficient number of points
  const north = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
    prevCoord[1] > currentCoord[1] ? prevCoord : currentCoord,
  );
  const east = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
    prevCoord[0] > currentCoord[0] ? prevCoord : currentCoord,
  );
  const south = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
    prevCoord[1] < currentCoord[1] ? prevCoord : currentCoord,
  );
  const west = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
    prevCoord[0] < currentCoord[0] ? prevCoord : currentCoord,
  );
  return [north, east, south, west];
};

const buildVertex = (parentId: string, coordinates: Position): Feature<Geometry, GeoJsonProperties> => ({
  type: 'Feature',
  properties: {
    meta: 'vertex',
    parent: parentId,
    coord_path: '0.0',
    active: 'true',
  },
  geometry: {
    type: 'Point',
    coordinates: [coordinates[0], coordinates[1]],
  },
});
