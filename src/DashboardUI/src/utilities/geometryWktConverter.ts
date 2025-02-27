import {
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';

// Implementations adapted from Mapbox library `wellknown`
// Source: https://github.com/mapbox/wellknown/blob/master/index.js

export const convertGeometryToWkt = (geometry: Geometry): string => {
  const pairWKT = (coord: Position) => {
    return `${coord[0]} ${coord[1]}`;
  };

  const linearRingWKT = (linearRing: Position[]) => {
    return linearRing.map(pairWKT).join(', ');
  };

  const polygonRingsWKT = (polygonRings: Position[][]) => {
    return polygonRings.map(linearRingWKT).map(wrapParens).join(', ');
  };

  const multiPolygonRingsWKT = (multiPolygonRings: Position[][][]) => {
    return multiPolygonRings.map(polygonRingsWKT).map(wrapParens).join(', ');
  };

  const wrapParens = (s: string) => `(${s})`;

  switch (geometry.type) {
    case 'Point': {
      const point = geometry as Point;
      if (point.coordinates.length === 0) {
        return 'POINT EMPTY';
      }
      return `POINT (${pairWKT(point.coordinates)})`;
    }
    case 'LineString': {
      const lineString = geometry as LineString;
      if (lineString.coordinates.length === 0) {
        return 'LINESTRING EMPTY';
      }
      return `LINESTRING (${linearRingWKT(lineString.coordinates)})`;
    }
    case 'Polygon': {
      const polygon = geometry as Polygon;
      if (polygon.coordinates.length === 0) {
        return 'POLYGON EMPTY';
      }
      return `POLYGON (${polygonRingsWKT(polygon.coordinates)})`;
    }
    case 'MultiPoint': {
      const multiPoint = geometry as MultiPoint;
      return `MULTIPOINT (${multiPoint.coordinates.map(pairWKT).map(wrapParens).join(', ')})`;
    }
    case 'MultiLineString': {
      const multiLineString = geometry as MultiLineString;
      return `MULTILINESTRING (${polygonRingsWKT(multiLineString.coordinates)})`;
    }
    case 'MultiPolygon': {
      const multiPolygon = geometry as MultiPolygon;
      return `MULTIPOLYGON (${multiPolygonRingsWKT(multiPolygon.coordinates)})`;
    }
    case 'GeometryCollection': {
      const geometries = geometry as GeometryCollection;
      return `GEOMETRYCOLLECTION (${geometries.geometries.map(convertGeometryToWkt).join(', ')})`;
    }
  }
};

const numberRegexp = /[-+]?([0-9]*\.[0-9]+|[0-9]+)([eE][-+]?[0-9]+)?/;
// Matches sequences like '100 100' or '100 100 100'.
const tuples = new RegExp('^' + numberRegexp.source + '(\\s' + numberRegexp.source + '){1,}');

export const convertWktToGeometry = (input: string): Geometry => {
  // example input: `SRID=4326;POINT(-44.3 60.1)`
  const parts = input.split(';');
  let geometryWkt = parts.pop()!;
  const srid = (parts.shift() || '').split('=').pop()!;

  let i = 0;

  function $(re: any) {
    const match = geometryWkt.substring(i).match(re);
    if (!match) return null;
    else {
      i += match[0].length;
      return match[0];
    }
  }

  function crs(obj: any) {
    if (obj && srid.match(/\d+/)) {
      obj.crs = {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::' + srid,
        },
      };
    }

    return obj;
  }

  function white() {
    $(/^\s*/);
  }

  function multicoords() {
    white();
    let depth = 0;
    const rings: any = [];
    const stack = [rings];
    let pointer = rings;
    let elem;

    while ((elem = $(/^(\()/) || $(/^(\))/) || $(/^(,)/) || $(tuples))) {
      if (elem === '(') {
        stack.push(pointer);
        pointer = [];
        stack[stack.length - 1].push(pointer);
        depth++;
      } else if (elem === ')') {
        // For the case: Polygon(), ...
        if (pointer.length === 0) return null;

        pointer = stack.pop();
        // the stack was empty, input was malformed
        if (!pointer) return null;
        depth--;
        if (depth === 0) break;
      } else if (elem === ',') {
        pointer = [];
        stack[stack.length - 1].push(pointer);
      } else if (!elem.split(/\s/g).some((x) => isNaN(Number(x)))) {
        Array.prototype.push.apply(pointer, elem.split(/\s/g).map(parseFloat));
      } else {
        return null;
      }
      white();
    }

    if (depth !== 0) return null;

    return rings;
  }

  function coords(): number[][] | null {
    const list: number[][] = [];
    let item: number[] = [];
    let pt;
    while ((pt = $(tuples) || $(/^(,)/))) {
      if (pt === ',') {
        list.push(item);
        item = [];
      } else if (!pt.split(/\s/g).some((x) => isNaN(Number(x)))) {
        if (!item) {
          item = [];
        }

        item.push(...pt.split(/\s/g).map(parseFloat));
      }
      white();
    }

    if (item) {
      list.push(item);
    } else {
      return null;
    }

    return list.length ? list : null;
  }

  function point(): Point | null {
    if (!$(/^(point(\sz)?)/i)) return null;
    white();
    if (!$(/^(\()/)) return null;
    const c = coords();
    if (!c) return null;
    white();
    if (!$(/^(\))/)) return null;
    return {
      type: 'Point',
      coordinates: c[0],
    };
  }

  function multipoint(): MultiPoint | null {
    if (!$(/^(multipoint)/i)) return null;
    white();
    const newCoordsFormat = geometryWkt
      .substring(geometryWkt.indexOf('(') + 1, geometryWkt.length - 1)
      .replace(/\(/g, '')
      .replace(/\)/g, '');
    geometryWkt = 'MULTIPOINT (' + newCoordsFormat + ')';
    const c = multicoords();
    if (!c) return null;
    white();
    return {
      type: 'MultiPoint',
      coordinates: c,
    };
  }

  function multilinestring(): MultiLineString | null {
    if (!$(/^(multilinestring)/i)) return null;
    white();
    const c = multicoords();
    if (!c) return null;
    white();
    return {
      type: 'MultiLineString',
      coordinates: c,
    };
  }

  function linestring(): LineString | null {
    if (!$(/^(linestring(\sz)?)/i)) return null;
    white();
    if (!$(/^(\()/)) return null;
    const c = coords();
    if (!c) return null;
    if (!$(/^(\))/)) return null;
    return {
      type: 'LineString',
      coordinates: c,
    };
  }

  function polygon(): Polygon | null {
    if (!$(/^(polygon(\sz)?)/i)) return null;
    white();
    const c = multicoords();
    if (!c) return null;
    return {
      type: 'Polygon',
      coordinates: c,
    };
  }

  function multipolygon(): MultiPolygon | null {
    if (!$(/^(multipolygon)/i)) return null;
    white();
    const c = multicoords();
    if (!c) return null;
    return {
      type: 'MultiPolygon',
      coordinates: c,
    };
  }

  function geometrycollection(): GeometryCollection | null {
    const geometries = [];
    let geometry;

    if (!$(/^(geometrycollection)/i)) return null;
    white();

    if (!$(/^(\()/)) return null;
    while ((geometry = root())) {
      geometries.push(geometry);
      white();
      $(/^(,)/);
      white();
    }
    if (!$(/^(\))/)) return null;

    return {
      type: 'GeometryCollection',
      geometries: geometries,
    };
  }

  function root(): Geometry | null {
    return (
      point() ||
      linestring() ||
      polygon() ||
      multipoint() ||
      multilinestring() ||
      multipolygon() ||
      geometrycollection()
    );
  }

  return crs(root());
};
