import { useEffect, useMemo } from 'react';
import { useWaterRightsContext } from '../../Provider';
import {
  pointSizes,
  waterRightsProperties,
} from '../../../../../config/constants';
import { useMapContext } from '../../../../../contexts/MapProvider';
import useLastKnownValue from '../../../../../hooks/useLastKnownValue';
import {
  defaultPointCircleRadius,
  defaultPointCircleSortKey,
  flowPointCircleSortKey,
  mapLayerNames,
  volumePointCircleSortKey,
} from '../../../../../config/maps';

const flowPointCircleRadiusFlow = [
  'coalesce',
  ['get', waterRightsProperties.maxFlowRate as string],
  0,
];
const volumePointCircleRadiusFlow = [
  'coalesce',
  ['get', waterRightsProperties.maxVolume as string],
  0,
];
export function useMapPointScaling() {
  const [minVolume, lastKnownMinVolume, setMinVolume] = useLastKnownValue(0);
  const [maxVolume, lastKnownMaxVolume, setMaxVolume] = useLastKnownValue(100);
  const [minFlow, lastKnownMinFlow, setMinFlow] = useLastKnownValue(0);
  const [maxFlow, lastKnownMaxFlow, setMaxFlow] = useLastKnownValue(100);
  const { renderedFeatures, setLayerCircleRadii, setLayerCircleSortKeys } =
    useMapContext();
  const {
    filters,
    displayOptions: { pointSize },
  } = useWaterRightsContext();

  const pointScaleTimeDelay = 1000;
  useEffect(() => {
    //we delay these to give the map time to get new rendered features after the filters change
    //check this if there are issues setting point sizes
    setTimeout(() => setMinFlow(undefined), pointScaleTimeDelay);
    setTimeout(() => setMaxFlow(undefined), pointScaleTimeDelay);
    setTimeout(() => setMinVolume(undefined), pointScaleTimeDelay);
    setTimeout(() => setMaxVolume(undefined), pointScaleTimeDelay);
  }, [filters, setMinFlow, setMaxFlow, setMinVolume, setMaxVolume]);

  const flowVolumeMinMax = useMemo(() => {
    if (renderedFeatures.length === 0) {
      return { minFlow: 0, maxFlow: 0, minVolume: 0, maxVolume: 0 };
    }
    const values = renderedFeatures.map((a) => ({
      flow: a.properties?.[waterRightsProperties.maxFlowRate as string] ?? 0,
      volume: a.properties?.[waterRightsProperties.maxVolume as string] ?? 0,
    }));
    return values.reduce(
      (prev, curr) => ({
        minFlow:
          prev.minFlow === undefined || curr.flow < prev.minFlow
            ? curr.flow
            : prev.minFlow,
        maxFlow:
          prev.maxFlow === undefined || curr.flow > prev.maxFlow
            ? curr.flow
            : prev.maxFlow,
        minVolume:
          prev.minVolume === undefined || curr.volume < prev.minVolume
            ? curr.volume
            : prev.minVolume,
        maxVolume:
          prev.maxVolume === undefined || curr.volume > prev.maxVolume
            ? curr.volume
            : prev.maxVolume,
      }),
      {
        minFlow: values[0].flow,
        maxFlow: values[0].flow,
        minVolume: values[0].volume,
        maxVolume: values[0].volume,
      },
    );
  }, [renderedFeatures]);

  useEffect(() => {
    if (minFlow === undefined || flowVolumeMinMax.minFlow < minFlow) {
      setMinFlow(flowVolumeMinMax.minFlow);
    }
  }, [minFlow, flowVolumeMinMax.minFlow, setMinFlow]);

  useEffect(() => {
    if (maxFlow === undefined || flowVolumeMinMax.maxFlow > maxFlow) {
      setMaxFlow(flowVolumeMinMax.maxFlow);
    }
  }, [maxFlow, flowVolumeMinMax.maxFlow, setMaxFlow]);

  useEffect(() => {
    if (minVolume === undefined || flowVolumeMinMax.minVolume < minVolume) {
      setMinVolume(flowVolumeMinMax.minVolume);
    }
  }, [minVolume, flowVolumeMinMax.minVolume, setMinVolume]);

  useEffect(() => {
    if (maxVolume === undefined || flowVolumeMinMax.maxVolume > maxVolume) {
      setMaxVolume(flowVolumeMinMax.maxVolume);
    }
  }, [maxVolume, flowVolumeMinMax.maxVolume, setMaxVolume]);

  const min = useMemo(() => {
    return pointSize === 'f'
      ? (filters.minFlow ?? lastKnownMinFlow)
      : (filters.minVolume ?? lastKnownMinVolume);
  }, [
    pointSize,
    lastKnownMinFlow,
    lastKnownMinVolume,
    filters.minFlow,
    filters.minVolume,
  ]);

  const max = useMemo(() => {
    return pointSize === 'f'
      ? (filters.maxFlow ?? lastKnownMaxFlow)
      : (filters.maxVolume ?? lastKnownMaxVolume);
  }, [
    pointSize,
    filters.maxFlow,
    filters.maxVolume,
    lastKnownMaxFlow,
    lastKnownMaxVolume,
  ]);

  const scaleProperty = useMemo(() => {
    return pointSize === 'f'
      ? flowPointCircleRadiusFlow
      : volumePointCircleRadiusFlow;
  }, [pointSize]);

  useEffect(() => {
    if (pointSize === 'd') {
      setLayerCircleRadii({
        layer: mapLayerNames.waterRightsPointsLayer,
        circleRadius: defaultPointCircleRadius,
      });
    } else {
      if (min === max) {
        setLayerCircleRadii({
          layer: mapLayerNames.waterRightsPointsLayer,
          circleRadius: defaultPointCircleRadius,
        });
      }
      const valueScaleFactorMinToMax = pointSizes.maxScaleFactorForSizedPoints; //the biggest point will be x times bigger than the smallest
      const zoomScaleFactorMinToMax =
        pointSizes.maxPointSize / pointSizes.minPointSize;
      const valueRange = max - min;
      const minSizeAtMinimumZoom = pointSizes.minPointSize;
      const maxSizeAtMinimumZoom =
        pointSizes.minPointSize * valueScaleFactorMinToMax;
      const sizeRange = maxSizeAtMinimumZoom - minSizeAtMinimumZoom;
      //(((vol-min)/(max-min))*(maxPointSize-minPointSize))+minPointSize === this point's size at minimum zoom
      const minZoomValue = [
        'min',
        [
          '+',
          ['*', ['/', ['-', scaleProperty, min], valueRange], sizeRange],
          minSizeAtMinimumZoom,
        ],
        maxSizeAtMinimumZoom,
      ];
      //size at minimum * zoomScaleFactorMinToMax === this point's size at maximum zoom
      const maxZoomValue = ['*', minZoomValue, zoomScaleFactorMinToMax];
      setLayerCircleRadii({
        layer: mapLayerNames.waterRightsPointsLayer,
        circleRadius: [
          'interpolate',
          ['linear'],
          ['zoom'],
          pointSizes.minPointSizeZoomLevel,
          minZoomValue,
          pointSizes.maxPointSizeZoomLevel,
          maxZoomValue,
        ],
      });
    }
  }, [pointSize, scaleProperty, min, max, setLayerCircleRadii]);

  useEffect(() => {
    if (pointSize === 'f') {
      setLayerCircleSortKeys({
        layer: mapLayerNames.waterRightsPointsLayer,
        circleSortKey: flowPointCircleSortKey,
      });
    } else if (pointSize === 'v') {
      setLayerCircleSortKeys({
        layer: mapLayerNames.waterRightsPointsLayer,
        circleSortKey: volumePointCircleSortKey,
      });
    } else {
      setLayerCircleSortKeys({
        layer: mapLayerNames.waterRightsPointsLayer,
        circleSortKey: defaultPointCircleSortKey,
      });
    }
  }, [pointSize, setLayerCircleSortKeys]);
}
