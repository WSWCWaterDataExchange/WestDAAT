import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import deepEqual from 'fast-deep-equal/es6';
import { WaterRightsFilters } from "../FilterProvider";
import { colorList, nldi, pointSizes, waterRightsProperties } from "../config/constants";
import { BeneficialUseListItem } from "../data-contracts/BeneficialUseListItem";
import { MapContext } from "../components/MapProvider";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import { DataPoints } from "../data-contracts/nldi";
import useLastKnownValue from "./useLastKnownValue";
import { defaultPointCircleRadius, defaultPointCircleSortKey, flowPointCircleSortKey, mapLayerNames, volumePointCircleSortKey } from "../config/maps";
import { AppContext } from "../AppProvider";

export enum MapGrouping {
  BeneficialUse = "bu",
  OwnerClassification = "oClass",
  WaterSourceType = "wsType"
}

export interface WaterRightsDisplayOptions {
  pointSize: 'd' | 'f' | 'v',
  mapGrouping: MapGrouping
}

export const defaultDisplayOptions: WaterRightsDisplayOptions = {
  pointSize: 'd',
  mapGrouping: MapGrouping.BeneficialUse
}

export function useWaterRightsDisplayOptions(filters: WaterRightsFilters, 
                                             allBeneficialUses: BeneficialUseListItem[] | undefined,
                                             allOwnerClassifications: string[] | undefined,
                                             allWaterSourceTypes: string[] | undefined) {
  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const [displayOptions, setDisplayOptions] = useState<WaterRightsDisplayOptions>(getUrlParam<WaterRightsDisplayOptions>("wrd") ?? defaultDisplayOptions);

  const {
    renderedFeatures,
    setLegend,
    setLayerCircleColors,
    setLayerFillColors,
  } = useContext(MapContext);
  
  const mapGrouping = useMemo(() => {
    let colorIndex = 0;
    let colorMapping: { key: string, color: string }[];
    switch (displayOptions.mapGrouping) {
      case MapGrouping.BeneficialUse:
        colorMapping = allBeneficialUses?.map(a => ({ key: a.beneficialUseName, color: colorList[colorIndex++ % colorList.length] })) ?? []
        break;
      case MapGrouping.OwnerClassification:
        colorMapping = allOwnerClassifications?.map(a => ({ key: a, color: colorList[colorIndex++ % colorList.length] })) ?? []
        break;
      case MapGrouping.WaterSourceType:
        colorMapping = allWaterSourceTypes?.map(a => ({ key: a, color: colorList[colorIndex++ % colorList.length] })) ?? []
        break;
    }
    return { property: displayOptions.mapGrouping as string, colorMapping }
  }, [displayOptions.mapGrouping, allBeneficialUses, allWaterSourceTypes, allOwnerClassifications])

  const renderedMapGroupings = useMemo(() => {
    const tryParseJsonArray = (value: any) => {
      try {
        return JSON.parse(value ?? "[]");
      } catch (e) {
        return [];
      }
    }
    let colorMappings = [...mapGrouping.colorMapping];
    if (mapGrouping.property === MapGrouping.BeneficialUse as string && filters.beneficialUses && filters.beneficialUses?.length > 0) {
      colorMappings = colorMappings.filter(a => filters.beneficialUses?.some(b => b.beneficialUseName === a.key));
    }
    if (mapGrouping.property === MapGrouping.WaterSourceType as string && filters.waterSourceTypes && filters.waterSourceTypes.length > 0) {
      colorMappings = colorMappings.filter(a => filters.waterSourceTypes?.some(b => b === a.key));
    }
    if (mapGrouping.property === MapGrouping.OwnerClassification as string && filters.ownerClassifications && filters.ownerClassifications.length > 0) {
      colorMappings = colorMappings.filter(a => filters.ownerClassifications?.some(b => b === a.key));
    }
    colorMappings = colorMappings.filter(a => renderedFeatures.some(b => b.properties && tryParseJsonArray(b.properties[mapGrouping.property]).some((c: string) => c === a.key)));

    return {
      property: mapGrouping.property,
      colorMapping: colorMappings
    }
  }, [mapGrouping, renderedFeatures, filters.beneficialUses, filters.waterSourceTypes, filters.ownerClassifications])

  useEffect(() => {
    let colorArray: any;
    if (mapGrouping.colorMapping.length > 0) {
      colorArray = ["case"];
      renderedMapGroupings.colorMapping.forEach(a => {
        colorArray.push(["in", a.key, ["get", mapGrouping.property]]);
        colorArray.push(a.color)
      })
      mapGrouping.colorMapping.forEach(a => {
        colorArray.push(["in", a.key, ["get", mapGrouping.property]]);
        colorArray.push(a.color)
      })
      colorArray.push("#000000");
    } else {
      colorArray = "#000000"
    }

    setLayerCircleColors({
      layer: mapLayerNames.waterRightsPointsLayer,
      circleColor: colorArray
    })
    setLayerFillColors({
      layer: mapLayerNames.waterRightsPolygonsLayer,
      fillColor: colorArray
    })
  }, [setLayerCircleColors, setLayerFillColors, mapGrouping, renderedMapGroupings])

  const isNldiMapActive = useMemo(() =>{
    return !!filters.nldiFilterData;
  }, [filters.nldiFilterData])

  useEffect(() => {
    if (renderedMapGroupings.colorMapping.length === 0 && !isNldiMapActive) {
      setLegend(null);
    } else {
      setLegend(
        <>
          {
            renderedMapGroupings.colorMapping.map(layer => {
              return (
                <div key={layer.key} className="legend-item">
                  <span className="legend-circle" style={{ "backgroundColor": layer.color }}></span>
                  {layer.key}
                </div>
              )
            })
          }
          {isNldiMapActive &&
            <div className="legend-nldi">
              <div className="legend-item">
                <span>
                  <Icon path={mdiMapMarker} size="14px" style={{ color: nldi.colors.mapMarker }} />
                </span>
                Starting Point of Interest
              </div>
              <div className="legend-item">
                <span className="legend-flowline">
                  <span className="legend-flowline legend-flowline-main" style={{ backgroundColor: nldi.colors.mainstem }} />
                </span>
                Mainstem
              </div>
              <div className="legend-item">
                <span>
                  <span className="legend-flowline legend-flowline-tributary" style={{ backgroundColor: nldi.colors.tributaries }} />
                </span>
                Tributaries
              </div>
              {!!((filters.nldiFilterData?.dataPoints ?? DataPoints.None) & DataPoints.Usgs) &&
                <div className="legend-item">
                  <span className="legend-circle" style={{ "backgroundColor": nldi.colors.usgs }}></span>
                  USGS NWIS Sites
                </div>
              }
              {!!((filters.nldiFilterData?.dataPoints ?? DataPoints.None) & DataPoints.Epa) &&
                <div className="legend-item">
                  <span className="legend-circle" style={{ "backgroundColor": nldi.colors.epa }}></span>
                  EPA Water Quality Portal<br /> Sites OSM Standard
                </div>
              }
            </div>
          }
        </>);
    }
  }, [setLegend, renderedMapGroupings, isNldiMapActive, filters.nldiFilterData?.dataPoints])

  useEffect(() => {
    if (deepEqual(displayOptions, defaultDisplayOptions)) {
      setUrlParam("wrd", undefined);
    } else {
      setUrlParam("wrd", displayOptions);
    }
  }, [displayOptions, setUrlParam])

  const setMapGrouping = useCallback((mapGrouping: MapGrouping | undefined) => {
    setDisplayOptions(s=>({...s, mapGrouping: mapGrouping ?? defaultDisplayOptions.mapGrouping}))
  }, [setDisplayOptions]);

  const setPointSize = useCallback((pointSize: string) => {
    setDisplayOptions(s=>({...s, pointSize: pointSize === "f" ? "f" : pointSize === "v" ? "v" : "d"}))
  }, [setDisplayOptions]);

  const resetDisplayOptions = useCallback(() => {
    setDisplayOptions(defaultDisplayOptions)
  }, [setDisplayOptions]);

  useWaterRightMapPointScaling(displayOptions.pointSize, filters);
  return {displayOptions, setMapGrouping, setPointSize, resetDisplayOptions};
}

const flowPointCircleRadiusFlow = ["coalesce", ["get", waterRightsProperties.maxFlowRate as string], 0];
const volumePointCircleRadiusFlow = ["coalesce", ["get", waterRightsProperties.maxVolume as string], 0];
function useWaterRightMapPointScaling(pointSize: "d" | "f" | "v", filters: WaterRightsFilters) {
  const [minVolume, lastKnownMinVolume, setMinVolume] = useLastKnownValue(0);
  const [maxVolume, lastKnownMaxVolume, setMaxVolume] = useLastKnownValue(100);
  const [minFlow, lastKnownMinFlow, setMinFlow] = useLastKnownValue(0);
  const [maxFlow, lastKnownMaxFlow, setMaxFlow] = useLastKnownValue(100);
  const {
    renderedFeatures,
    setLayerCircleRadii,
    setLayerCircleSortKeys
  } = useContext(MapContext);

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
      return { minFlow: 0, maxFlow: 0, minVolume: 0, maxVolume: 0 }
    }
    const values = renderedFeatures
      .map(a => ({
        flow: (a.properties?.[waterRightsProperties.maxFlowRate as string]) ?? 0,
        volume: (a.properties?.[waterRightsProperties.maxVolume as string]) ?? 0
      }));
    return values
      .reduce((prev, curr) => (
        {
          minFlow: prev.minFlow === undefined || curr.flow < prev.minFlow ? curr.flow : prev.minFlow,
          maxFlow: prev.maxFlow === undefined || curr.flow > prev.maxFlow ? curr.flow : prev.maxFlow,
          minVolume: prev.minVolume === undefined || curr.volume < prev.minVolume ? curr.volume : prev.minVolume,
          maxVolume: prev.maxVolume === undefined || curr.volume > prev.maxVolume ? curr.volume : prev.maxVolume
        }
      ), { minFlow: values[0].flow, maxFlow: values[0].flow, minVolume: values[0].volume, maxVolume: values[0].volume })
  }, [renderedFeatures])

  useEffect(() => {
    if (minFlow === undefined || flowVolumeMinMax.minFlow < minFlow) {
      setMinFlow(flowVolumeMinMax.minFlow)
    }
  }, [minFlow, flowVolumeMinMax.minFlow, setMinFlow])

  useEffect(() => {
    if (maxFlow === undefined || flowVolumeMinMax.maxFlow > maxFlow) {
      setMaxFlow(flowVolumeMinMax.maxFlow)
    }
  }, [maxFlow, flowVolumeMinMax.maxFlow, setMaxFlow])

  useEffect(() => {
    if (minVolume === undefined || flowVolumeMinMax.minVolume < minVolume) {
      setMinVolume(flowVolumeMinMax.minVolume)
    }
  }, [minVolume, flowVolumeMinMax.minVolume, setMinVolume])

  useEffect(() => {
    if (maxVolume === undefined || flowVolumeMinMax.maxVolume > maxVolume) {
      setMaxVolume(flowVolumeMinMax.maxVolume)
    }
  }, [maxVolume, flowVolumeMinMax.maxVolume, setMaxVolume])

  const min = useMemo(() => {
    return pointSize === "f" ? filters.minFlow ?? lastKnownMinFlow : filters.minVolume ?? lastKnownMinVolume;
  }, [pointSize, lastKnownMinFlow, lastKnownMinVolume, filters.minFlow, filters.minVolume])

  const max = useMemo(() => {
    return pointSize === "f" ? filters.maxFlow ?? lastKnownMaxFlow : filters.maxVolume ?? lastKnownMaxVolume;
  }, [pointSize, filters.maxFlow, filters.maxVolume, lastKnownMaxFlow, lastKnownMaxVolume])

  const scaleProperty = useMemo(() => {
    return pointSize === "f" ? flowPointCircleRadiusFlow : volumePointCircleRadiusFlow;
  }, [pointSize])

  useEffect(() => {
    if (pointSize === "d") {
      setLayerCircleRadii({ layer: mapLayerNames.waterRightsPointsLayer, circleRadius: defaultPointCircleRadius })
    } else {
      if (min === max) {
        setLayerCircleRadii({ layer: mapLayerNames.waterRightsPointsLayer, circleRadius: defaultPointCircleRadius })
      }
      const valueScaleFactorMinToMax = pointSizes.maxScaleFactorForSizedPoints;//the biggest point will be x times bigger than the smallest
      const zoomScaleFactorMinToMax = pointSizes.maxPointSize / pointSizes.minPointSize;
      const valueRange = max - min;
      const minSizeAtMinimumZoom = pointSizes.minPointSize;
      const maxSizeAtMinimumZoom = pointSizes.minPointSize * valueScaleFactorMinToMax;
      const sizeRange = maxSizeAtMinimumZoom - minSizeAtMinimumZoom;
      //(((vol-min)/(max-min))*(maxPointSize-minPointSize))+minPointSize === this point's size at minimum zoom
      const minZoomValue = ["min", ["+", ["*", ["/", ["-", scaleProperty, min], valueRange], sizeRange], minSizeAtMinimumZoom], maxSizeAtMinimumZoom]
      //size at minimum * zoomScaleFactorMinToMax === this point's size at maximum zoom
      const maxZoomValue = ["*", minZoomValue, zoomScaleFactorMinToMax]
      setLayerCircleRadii({ layer: mapLayerNames.waterRightsPointsLayer, circleRadius: ["interpolate", ["linear"], ["zoom"], pointSizes.minPointSizeZoomLevel, minZoomValue, pointSizes.maxPointSizeZoomLevel, maxZoomValue] })
    }
  }, [pointSize, scaleProperty, min, max, setLayerCircleRadii])

  useEffect(() => {
    if (pointSize === "f") {
      setLayerCircleSortKeys({ layer: mapLayerNames.waterRightsPointsLayer, circleSortKey: flowPointCircleSortKey })
    } else if (pointSize === "v") {
      setLayerCircleSortKeys({ layer: mapLayerNames.waterRightsPointsLayer, circleSortKey: volumePointCircleSortKey })
    } else {
      setLayerCircleSortKeys({ layer: mapLayerNames.waterRightsPointsLayer, circleSortKey: defaultPointCircleSortKey })
    }
  }, [pointSize, setLayerCircleSortKeys])
}
