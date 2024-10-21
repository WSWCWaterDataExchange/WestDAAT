import { useCallback, useEffect, useMemo } from 'react';
import { useWaterRightsContext, defaultNldiFilters } from '../../Provider';
import { waterRightsProperties } from '../../../../../config/constants';
import { DataPoints, Directions } from '../../../../../data-contracts/nldi';
import { useNldiFeatures } from '../../../../../hooks/queries/useNldiQuery';
import deepEqual from 'fast-deep-equal/es6';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames, mapSourceNames } from '../../../../../config/maps';
import { useDebounce } from 'usehooks-ts';

const emptyGeoJsonData: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [],
};
type DataPointType = DataPoints.Wade | DataPoints.Usgs | DataPoints.Epa;
const pointFeatureDataSourceNameKeys: DataPointType[] = [
  DataPoints.Wade,
  DataPoints.Usgs,
  DataPoints.Epa,
];
const pointFeatureDataSourceNames: Record<DataPointType, string> = {
  [DataPoints.Wade]: 'Wade',
  [DataPoints.Usgs]: 'UsgsSurfaceWaterSite',
  [DataPoints.Epa]: 'EpaWaterQualitySite',
};

type DirectionsType = Directions.Upsteam | Directions.Downsteam;
const directionNameKeys: DirectionsType[] = [
  Directions.Upsteam,
  Directions.Downsteam,
];
const directionNames: Record<DirectionsType, string> = {
  [Directions.Upsteam]: 'Upstream',
  [Directions.Downsteam]: 'Downstream',
};
export function useNldiFilter() {
  const { setGeoJsonData, setLayerFilters: setMapLayerFilters } =
    useMapContext();
  const {
    filters: { nldiFilterData, isNldiFilterActive },
    setFilters,
    setNldiIds,
  } = useWaterRightsContext();

  const [debouncedLatitude, debouncedLongitude] = useDebounce(
    [nldiFilterData?.latitude ?? null, nldiFilterData?.longitude ?? null],
    400,
  );
  const nldiFeaturesQuery = useNldiFeatures(
    debouncedLatitude,
    debouncedLongitude,
  );
  const { data: nldiGeoJsonData } = nldiFeaturesQuery;

  useEffect(() => {
    if (nldiGeoJsonData) {
      setGeoJsonData(mapSourceNames.nldiGeoJson, nldiGeoJsonData);
    } else {
      setGeoJsonData(mapSourceNames.nldiGeoJson, emptyGeoJsonData);
    }
  }, [nldiGeoJsonData, setGeoJsonData]);

  const nldiWadeSiteIds = useMemo(() => {
    if (
      !isNldiFilterActive ||
      !nldiGeoJsonData ||
      !nldiFilterData ||
      !(nldiFilterData.dataPoints & DataPoints.Wade)
    ) {
      return [];
    }

    let arr = nldiGeoJsonData.features.filter(
      (x) =>
        x.properties?.westdaat_pointdatasource?.toLowerCase() === 'wade' ||
        x.properties?.source?.toLowerCase() === 'wade',
    );

    if (
      nldiFilterData.directions & Directions.Upsteam &&
      !(nldiFilterData.directions & Directions.Downsteam)
    ) {
      arr = arr.filter((x) => x.properties?.westdaat_direction === 'Upstream');
    } else if (
      !(nldiFilterData.directions & Directions.Upsteam) &&
      nldiFilterData.directions & Directions.Downsteam
    ) {
      arr = arr.filter(
        (x) => x.properties?.westdaat_direction === 'Downstream',
      );
    } else if (
      !(nldiFilterData.directions & Directions.Upsteam) &&
      !(nldiFilterData.directions & Directions.Downsteam)
    ) {
      return [];
    }
    return arr
      .filter(
        (x) =>
          x.properties?.identifier !== null &&
          x.properties?.identifier !== undefined,
      )
      .map((a) => a.properties?.identifier);
  }, [nldiGeoJsonData, nldiFilterData, isNldiFilterActive]);

  useEffect(() => {
    setNldiIds((previousState) => {
      if (deepEqual(previousState, nldiWadeSiteIds)) {
        return previousState;
      }
      return nldiWadeSiteIds;
    });
  }, [nldiWadeSiteIds, setNldiIds]);

  useEffect(() => {
    const pointsTypeFilters: any[] = ['any'];
    if (nldiFilterData?.dataPoints) {
      for (const key of pointFeatureDataSourceNameKeys) {
        if (nldiFilterData.dataPoints & key) {
          pointsTypeFilters.push([
            '==',
            ['get', 'westdaat_pointdatasource'],
            pointFeatureDataSourceNames[key],
          ]);
        }
      }
    }

    const directionFilters: any[] = ['any'];
    if (nldiFilterData?.directions) {
      for (const key of directionNameKeys) {
        if (nldiFilterData.directions & key) {
          directionFilters.push([
            '==',
            ['get', 'westdaat_direction'],
            directionNames[key],
          ]);
        }
      }
    }

    setMapLayerFilters([
      {
        layer: mapLayerNames.nldiUsgsPointsLayer,
        filter: [
          'all',
          ['==', ['get', 'westdaat_featuredatatype'], 'Point'],
          ['!=', ['get', 'westdaat_pointdatasource'], 'Wade'],
          pointsTypeFilters,
          directionFilters,
        ],
      },
      {
        layer: mapLayerNames.nldiFlowlinesLayer,
        filter: [
          'all',
          ['==', ['get', 'westdaat_featuredatatype'], 'Flowline'],
          directionFilters,
        ],
      },
    ]);
  }, [
    nldiFilterData?.dataPoints,
    nldiFilterData?.directions,
    setMapLayerFilters,
  ]);

  const mapFilters = useMemo((): any[] | undefined => {
    if (isNldiFilterActive && nldiWadeSiteIds !== undefined) {
      return [
        'in',
        ['get', waterRightsProperties.siteUuid],
        ['literal', nldiWadeSiteIds],
      ];
    }
  }, [isNldiFilterActive, nldiWadeSiteIds]);

  const setNldiMapActiveStatus = useCallback(
    (isActive: boolean) => {
      setFilters((s) => ({
        ...s,
        isNldiFilterActive: isActive,
        nldiFilterData:
          s.nldiFilterData ?? (isActive ? defaultNldiFilters : undefined),
      }));
    },
    [setFilters],
  );

  const setLatLong = useCallback(
    (latitude: number | null, longitude: number | null) => {
      setFilters((s) => ({
        ...s,
        nldiFilterData: {
          ...(s.nldiFilterData ?? defaultNldiFilters),
          latitude,
          longitude,
        },
      }));
    },
    [setFilters],
  );

  const setDataPoints = useCallback(
    (dataPoints: DataPoints) => {
      setFilters((s) => ({
        ...s,
        nldiFilterData: {
          ...(s.nldiFilterData ?? defaultNldiFilters),
          dataPoints,
        },
      }));
    },
    [setFilters],
  );

  const setDirections = useCallback(
    (directions: Directions) => {
      setFilters((s) => ({
        ...s,
        nldiFilterData: {
          ...(s.nldiFilterData ?? defaultNldiFilters),
          directions,
        },
      }));
    },
    [setFilters],
  );

  return {
    isNldiFilterActive,
    nldiFilterData,
    nldiFeaturesQuery,
    setNldiMapActiveStatus,
    setLatLong,
    setDataPoints,
    setDirections,
    mapFilters,
  };
}
