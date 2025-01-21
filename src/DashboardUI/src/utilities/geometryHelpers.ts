import { circle } from '@turf/circle';
import { distance } from '@turf/distance';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Polygon, Position } from 'geojson';
import { LngLat } from 'mapbox-gl';

export function getLatsLongsFromFeatureCollection(
  featureCollection: FeatureCollection<Geometry, GeoJsonProperties>,
): LngLat[] {
  let positions: Position[] = [];

  featureCollection.features.forEach((x) => {
    if (x.geometry.type === 'Point') {
      positions.push(x.geometry.coordinates);
    } else if (x.geometry.type === 'MultiPoint') {
      positions = positions.concat(x.geometry.coordinates);
    } else if (x.geometry.type === 'Polygon') {
      x.geometry.coordinates.forEach((y) => {
        positions = positions.concat(y);
      });
    } else if (x.geometry.type === 'MultiPolygon') {
      x.geometry.coordinates.forEach((y) => {
        y.forEach((z) => {
          positions = positions.concat(z);
        });
      });
    }
  });

  return positions.map((a) => new LngLat(a[0], a[1]));
}

export const generateCircleWithRadiusFromCenterPointToEdgePoint = (
  circleCenterPoint: number[],
  circleEdgePoint: number[],
): Feature<Polygon, GeoJsonProperties> => {
  const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
    units: 'kilometers',
  });
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 100 });
};

export const getCardinalDirectionCoordinatesOnFeature = (
  featureCoordinates: Position[],
): [Position, Position, Position, Position] => {
  // technically this gets the coordinates that align *most closely* with the cardinal directions
  // but the distinction doesn't really matter for a circle containing a sufficient number of points
  const north = featureCoordinates.reduce((prevCoord, currentCoord) =>
    prevCoord[1] > currentCoord[1] ? prevCoord : currentCoord,
  );
  const east = featureCoordinates.reduce((prevCoord, currentCoord) =>
    prevCoord[0] > currentCoord[0] ? prevCoord : currentCoord,
  );
  const south = featureCoordinates.reduce((prevCoord, currentCoord) =>
    prevCoord[1] < currentCoord[1] ? prevCoord : currentCoord,
  );
  const west = featureCoordinates.reduce((prevCoord, currentCoord) =>
    prevCoord[0] < currentCoord[0] ? prevCoord : currentCoord,
  );
  return [north, east, south, west];
};
