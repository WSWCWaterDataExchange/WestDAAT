import { useCallback, useEffect, useMemo } from 'react';
import { useWaterRightsContext, defaultNldiFilters } from '../../WaterRightsProvider';
import { waterRightsProperties } from '../../../../../../config/constants';
import { DataPoints, Directions } from '../../../../../../data-contracts/nldi';
import { useNldiFeatures } from '../../../../../../hooks/queries/useNldiQuery';
import deepEqual from 'fast-deep-equal/es6';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { useMapContext } from '../../../../../../contexts/MapProvider';
import { mapLayerNames, mapSourceNames } from '../../../../../../config/maps';
import { useDebounce } from '@react-hook/debounce';

const emptyGeoJsonData: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [],
};

type DataPointType = DataPoints.WadeRights | DataPoints.WadeTimeseries | DataPoints.Usgs | DataPoints.Epa;

const pointFeatureDataSourceNameKeys: DataPointType[] = [
  DataPoints.WadeRights,
  DataPoints.WadeTimeseries,
  DataPoints.Usgs,
  DataPoints.Epa,
];

const pointFeatureDataSourceNames: Record<DataPointType, string> = {
  [DataPoints.WadeRights]: 'WadeWaterRights',
  [DataPoints.WadeTimeseries]: 'WadeTimeseries',
  [DataPoints.Usgs]: 'UsgsSurfaceWaterSite',
  [DataPoints.Epa]: 'EpaWaterQualitySite',
};

type DirectionsType = Directions.Upstream | Directions.Downstream;
const directionNameKeys: DirectionsType[] = [Directions.Upstream, Directions.Downstream];
const directionNames: Record<DirectionsType, string> = {
  [Directions.Upstream]: 'Upstream',
  [Directions.Downstream]: 'Downstream',
};
export function useNldiFilter() {
  const { setGeoJsonData, setLayerFilters } = useMapContext();
  const {
    filters: { nldiFilterData, isNldiFilterActive },
    setFilters,
    setNldiIds,
  } = useWaterRightsContext();

  const [debouncedCoords, setDebouncedCoords] = useDebounce(
    [nldiFilterData?.latitude ?? null, nldiFilterData?.longitude ?? null],
    400,
  );
  const debouncedLatitude = debouncedCoords[0];
  const debouncedLongitude = debouncedCoords[1];

  useEffect(() => {
    setDebouncedCoords([nldiFilterData?.latitude ?? null, nldiFilterData?.longitude ?? null]);
  }, [nldiFilterData?.latitude, nldiFilterData?.longitude, setDebouncedCoords]);
  const nldiFeaturesQuery = useNldiFeatures(debouncedLatitude, debouncedLongitude);
  const { data: nldiGeoJsonData } = nldiFeaturesQuery;

  useEffect(() => {
    if (nldiGeoJsonData) {
      setGeoJsonData(mapSourceNames.nldiGeoJson, nldiGeoJsonData);
    } else {
      setGeoJsonData(mapSourceNames.nldiGeoJson, emptyGeoJsonData);
    }
  }, [nldiGeoJsonData, setGeoJsonData]);

  const nldiWadeSiteIds = useMemo(() => {
    if (!isNldiFilterActive || !nldiGeoJsonData || !nldiFilterData) {
      return [];
    }

    const isWadeRights = Boolean(nldiFilterData.dataPoints & DataPoints.WadeRights);
    const isWadeTimeseries = Boolean(nldiFilterData.dataPoints & DataPoints.WadeTimeseries);

    if (!isWadeRights && !isWadeTimeseries) {
      return [];
    }

    const acceptableSources: string[] = [];
    if (isWadeRights) {
      acceptableSources.push('wadewaterrights');
    }
    if (isWadeTimeseries) {
      acceptableSources.push('wadetimeseries');
    }

    let arr = nldiGeoJsonData.features.filter((feature) => {
      const ds = feature.properties?.westdaat_pointdatasource?.toLowerCase();
      return ds && acceptableSources.includes(ds);
    });

    if (nldiFilterData.directions & Directions.Upstream && !(nldiFilterData.directions & Directions.Downstream)) {
      arr = arr.filter((x) => x.properties?.westdaat_direction === 'Upstream');
    } else if (
      !(nldiFilterData.directions & Directions.Upstream) &&
      nldiFilterData.directions & Directions.Downstream
    ) {
      arr = arr.filter((x) => x.properties?.westdaat_direction === 'Downstream');
    } else if (
      !(nldiFilterData.directions & Directions.Upstream) &&
      !(nldiFilterData.directions & Directions.Downstream)
    ) {
      return [];
    }
    return arr.filter((x) => x.properties?.identifier != null).map((x) => x.properties!.identifier);
  }, [nldiGeoJsonData, nldiFilterData, isNldiFilterActive]);

  useEffect(() => {
    setNldiIds((prev) => {
      if (deepEqual(prev, nldiWadeSiteIds)) {
        return prev;
      }
      return nldiWadeSiteIds;
    });
  }, [nldiWadeSiteIds, setNldiIds]);

  useEffect(() => {
    const pointsTypeFilters: any[] = ['any'];
    if (nldiFilterData?.dataPoints) {
      for (const key of pointFeatureDataSourceNameKeys) {
        if (nldiFilterData.dataPoints & key) {
          pointsTypeFilters.push(['==', ['get', 'westdaat_pointdatasource'], pointFeatureDataSourceNames[key]]);
        }
      }
    }

    const directionFilters: any[] = ['any'];
    if (nldiFilterData?.directions) {
      for (const key of directionNameKeys) {
        if (nldiFilterData.directions & key) {
          directionFilters.push(['==', ['get', 'westdaat_direction'], directionNames[key]]);
        }
      }
    }

    setLayerFilters([
      {
        layer: mapLayerNames.nldiUsgsPointsLayer,
        filter: [
          'all',
          ['==', ['get', 'westdaat_featuredatatype'], 'Point'],
          ['!=', ['get', 'westdaat_pointdatasource'], 'WadeWaterRights'],
          pointsTypeFilters,
          directionFilters,
        ],
      },
      {
        layer: mapLayerNames.nldiFlowlinesLayer,
        filter: ['all', ['==', ['get', 'westdaat_featuredatatype'], 'Flowline'], directionFilters],
      },
    ]);
  }, [nldiFilterData?.dataPoints, nldiFilterData?.directions, setLayerFilters]);

  const mapFilters = useMemo((): any[] | undefined => {
    if (isNldiFilterActive && nldiWadeSiteIds !== undefined) {
      return ['in', ['get', waterRightsProperties.siteUuid], ['literal', nldiWadeSiteIds]];
    }
  }, [isNldiFilterActive, nldiWadeSiteIds]);

  const setNldiMapActiveStatus = useCallback(
    (isActive: boolean) => {
      setFilters((s) => ({
        ...s,
        isNldiFilterActive: isActive,
        nldiFilterData: s.nldiFilterData ?? (isActive ? defaultNldiFilters : undefined),
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
