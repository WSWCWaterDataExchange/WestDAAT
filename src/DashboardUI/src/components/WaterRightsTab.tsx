import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRange";
import { MapContext } from "./MapProvider";
import VolumeRange from "./VolumeRange";
import { AppContext } from "../AppProvider";
import { MapThemeSelector } from "./MapThemeSelector";
import deepEqual from 'fast-deep-equal/es6';
import useProgressIndicator from "../hooks/useProgressIndicator";
import { useDebounceCallback } from "@react-hook/debounce";
import { useMapErrorAlert, useNoMapResults } from "../hooks/useMapAlert";
import { PriorityDateRange } from "./PriorityDateRange";
import { useWaterRightsMapPopup } from "../hooks/useWaterRightsMapPopup";
import { waterRightsProperties, pointSizes, nldi, colorList } from "../config/constants";
import { useBeneficialUses, useOwnerClassifications, useStates, useWaterSourceTypes } from "../hooks/useSystemQuery";
import { defaultPointCircleRadius, defaultPointCircleSortKey, flowPointCircleSortKey, volumePointCircleSortKey } from "../config/maps";
import useLastKnownValue from "../hooks/useLastKnownValue";
import { useRiverBasinOptions } from '../hooks';
import { getRiverBasinPolygonsByName } from '../accessors/systemAccessor';
import { useQuery } from 'react-query';
import { Accordion } from "react-bootstrap";
import '../App.scss';
import BeneficialUseSelect from "./BeneficialUseSelect";
import { BeneficialUseListItem } from "../data-contracts/BeneficialUseListItem";
import NldiTab from "./NldiTab";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { FeatureCollection } from "geojson";
import { Directions } from "../data-contracts/nldi";
import Select from "react-select";
import { FilterContext, WaterRightsFilters } from "../FilterProvider";

enum MapGrouping {
  BeneficialUse = "bu",
  OwnerClassification = "oClass",
  WaterSourceType = "wsType"
}

interface WaterRightsDisplayOptions {
  pointSize: 'd' | 'f' | 'v',
  mapGrouping: MapGrouping
}

const mapDataTiers = [
  'https://api.maptiler.com/tiles/1e068efa-3cd5-4509-a1aa-286c135fc85c/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/61b00cf0-537e-456c-9d6c-ad1d4a8ec597/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/c03b0c46-b9c3-4574-8498-cbebca00b871/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/6d61092a-7c8a-4cd1-8272-d92cf019730c/tiles.json?key=IauIQDaqjd29nJc5kJse'
]

const mapColorLegendOptions = [
  { value: MapGrouping.BeneficialUse, label: 'Beneficial Use' },
  { value: MapGrouping.OwnerClassification, label: 'Owner Classification' },
  { value: MapGrouping.WaterSourceType, label: 'Water Source Type' }
];

const waterRightsPointsLayer = 'waterRightsPoints';
const waterRightsPolygonsLayer = 'waterRightsPolygons';
const waterRightsRiverBasinLayer = 'river-basins';
const nldiLayer = ['nldi-flowlines', 'nldi-usgs-location', 'nldi-usgs-points'];

const allWaterRightsLayers = [
  waterRightsPointsLayer,
  waterRightsPolygonsLayer
]

const defaultFilters: WaterRightsFilters = {
  beneficialUses: [],
  ownerClassifications: [],
  allocationOwner: undefined,
  waterSourceTypes: [],
  states: [],
  riverBasinNames: [],
  includeExempt: false,
  minFlow: undefined,
  maxFlow: undefined,
  minVolume: undefined,
  maxVolume: undefined,
  podPou: undefined,
  minPriorityDate: undefined,
  maxPriorityDate: undefined,
  polyline: [],
  nldiFilterData: null
}

const defaultDisplayOptions: WaterRightsDisplayOptions = {
  pointSize: 'd',
  mapGrouping: MapGrouping.BeneficialUse
}

const exemptMapping = new Map<boolean | undefined, '' | '0' | '1'>([
  [undefined, ''],
  [true, '1'],
  [false, '0'],
])

const podPouRadios = [
  { name: 'Points of Diversion', value: 'POD' },
  { name: 'Places of Use', value: 'POU' },
  { name: 'Both', value: '' },
];

const exemptRadios = [
  { name: 'Exempt', value: exemptMapping.get(true) ?? '1' },
  { name: 'Non-exempt', value: exemptMapping.get(false) ?? '0' },
  { name: 'Both', value: exemptMapping.get(undefined) ?? '' },
];

const pointSizeRadios: { name: 'Default' | 'Flow' | 'Volume', value: 'd' | 'f' | 'v' }[] = [
  { name: 'Default', value: 'd' },
  { name: 'Flow', value: 'f' },
  { name: 'Volume', value: 'v' },
];

function WaterRightsTab() {
  const { data: allBeneficialUses, isFetching: isAllBeneficialUsesLoading, isError: isAllBeneficialUsesError } = useBeneficialUses();
  const { data: allWaterSourceTypes, isFetching: isAllWaterSourceTypesLoading, isError: isAllWaterSourceTypesError } = useWaterSourceTypes();
  const { data: allOwnerClassifications, isFetching: isAllOwnerClassificationsLoading, isError: isAllOwnerClassificationsError } = useOwnerClassifications();
  const { data: allStates, isFetching: isAllStatesLoading, isError: isAllStatesError } = useStates();
  const { data: allRiverBasinOptions, isFetching: isRiverBasinOptionsLoading } = useRiverBasinOptions();
  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const { filters, setFilters } = useContext(FilterContext);
  const { data: riverBasinPolygons, isFetching: isRiverBasinPolygonsLoading } = useQuery(['riverBasinPolygonsByName', filters.riverBasinNames ?? []], async (): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined> => {
    if ((filters?.riverBasinNames?.length ?? 0) === 0) {
      return undefined;
    }
    return await getRiverBasinPolygonsByName(filters?.riverBasinNames ?? []);
  }, { keepPreviousData: true });
  const [displayOptions, setDisplayOptions] = useState<WaterRightsDisplayOptions>(getUrlParam<WaterRightsDisplayOptions>("wrd") ?? defaultDisplayOptions);

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

  const {
    setLegend,
    setLayerFilters: setMapLayerFilters,
    setVisibleLayers,
    renderedFeatures,
    polylines,
    setPolylines,
    setLayerCircleColors,
    setLayerFillColors,
    setVectorUrl,
    geoJsonData,
    setGeoJsonData,
    nldiFilterData
  } = useContext(MapContext);

  const [isNldiMapActive, setNldiMapStatus] = useState<boolean>(false);

  useEffect(() => {
    for (var element of filters.polyline) {
      setPolylines(element.identifier, element.data);
    }
  }, [setPolylines])/* eslint-disable-line *//* we don't want to run multiple times thats why we don't add the filters.polyline */

  useEffect(() => {
    setFilters((s) => ({
      ...s,
      polyline: polylines
    }))
  }, [setFilters, polylines])

  useEffect(() => {
    setFilters((s) => ({
      ...s,
      nldiFilterData: nldiFilterData
    }))
  }, [setFilters, nldiFilterData])

  useEffect(() => {
    let params = (new URL(document.location.href)).searchParams;
    let tier = parseInt(params.get("tier") ?? "");
    if (!isNaN(tier) && tier >= 0 && tier < mapDataTiers.length) {
      setVectorUrl('allocation-sites_1', mapDataTiers[tier])
    }
  }, [setVectorUrl, isNldiMapActive])

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
      layer: waterRightsPointsLayer,
      circleColor: colorArray
    })
    setLayerFillColors({
      layer: waterRightsPolygonsLayer,
      fillColor: colorArray
    })
  }, [setLayerCircleColors, setLayerFillColors, mapGrouping, renderedMapGroupings])

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
              <div className="legend-item">
                <span className="legend-circle" style={{ "backgroundColor": nldi.colors.usgs }}></span>
                USGS NWIS Sites
              </div>
              <div className="legend-item">
                <span className="legend-circle" style={{ "backgroundColor": nldi.colors.epa }}></span>
                EPA Water Quality Portal<br /> Sites OSM Standard
              </div>
            </div>
          }
        </>);
    }
  }, [setLegend, renderedMapGroupings, isNldiMapActive])

  const [allocationOwnerValue, setAllocationOwnerValue] = useState(filters.allocationOwner ?? "")
  const hasRenderedFeatures = useMemo(() => renderedFeatures.length > 0, [renderedFeatures.length]);
  const nldiWadeSiteIds = useMemo(() => {
    var nldiData = geoJsonData.filter(s => s.source === 'nldi');
    if (nldiData && nldiData.length > 0 && nldiFilterData !== null) {
      var arr = (nldiData[0].data as FeatureCollection).features
        .filter(x => x.properties?.westdaat_pointdatasource?.toLowerCase() === 'wade' || x.properties?.source?.toLowerCase() === 'wade');

      if ((nldiFilterData?.directions & Directions.Upsteam) && !(nldiFilterData?.directions & Directions.Downsteam)) {
        arr = arr.filter(x => x.properties?.westdaat_direction === 'Upstream');
      } else if (!(nldiFilterData?.directions & Directions.Upsteam) && (nldiFilterData?.directions & Directions.Downsteam)) {
        arr = arr.filter(x => x.properties?.westdaat_direction === 'Downstream');
      } else if (!(nldiFilterData?.directions & Directions.Upsteam) && !(nldiFilterData?.directions & Directions.Downsteam)) {
        return
      }
      return arr.filter(x => x.properties?.identifier !== null && x.properties?.identifier !== undefined)
        .map(a => a.properties?.identifier)
    }
  }, [geoJsonData, nldiFilterData])

  useEffect(() => {
    if (deepEqual(filters, defaultFilters)) {
      setUrlParam("wr", undefined);
    } else {
      setUrlParam("wr", filters);
    }
  }, [filters, setUrlParam])

  useEffect(() => {
    if (deepEqual(displayOptions, defaultDisplayOptions)) {
      setUrlParam("wrd", undefined);
    } else {
      setUrlParam("wrd", displayOptions);
    }
  }, [displayOptions, setUrlParam])

  const handleMapGroupingChange = (mapGroupingOption: MapGrouping | undefined) => {
    setDisplayOptions(s => ({
      ...s,
      mapGrouping: mapGroupingOption ? mapGroupingOption : MapGrouping.BeneficialUse
    }));
  }

  const handlePodPouChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(s => ({
      ...s,
      podPou: e.target.value === "POD" || e.target.value === "POU" ? e.target.value : undefined
    }));
  }

  const handleExemptChange = (e: ChangeEvent<HTMLInputElement>) => {
    let result: boolean | undefined = undefined;
    if (e.target.value === "1") {
      result = true;
    } else if (e.target.value === "0") {
      result = false;
    }
    setFilters(s => ({
      ...s,
      includeExempt: result
    }));
  }

  const handlePointSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayOptions(s => ({
      ...s,
      pointSize: e.target.value === "f" ? "f" : e.target.value === "v" ? "v" : "d"
    }));
  }

  const handleBeneficialUseChange = (selectedOptions: BeneficialUseListItem[]) => {
    setFilters(s => ({
      ...s,
      beneficialUses: selectedOptions?.length > 0 ? selectedOptions : []
    }));
  }

  const handleStateChange = (selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      states: selectedOptions.length > 0 ? selectedOptions : []
    }));
  }

  const handleOwnerClassificationChange = (selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      ownerClassifications: selectedOptions.length > 0 ? selectedOptions : []
    }));
  }

  const setAllocationOwner = useDebounceCallback((allocationOwnerValue: string) => {
    setFilters(s => ({
      ...s,
      allocationOwner: allocationOwnerValue.length > 0 ? allocationOwnerValue : undefined
    }));
  }, 400)

  const handleAllocationOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    setAllocationOwnerValue(value);
    setAllocationOwner(value)
  }

  const handleWaterSourceTypeChange = (selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      waterSourceTypes: selectedOptions.length > 0 ? selectedOptions : []
    }));
  }

  const handleRiverBasinChange = async (riverBasinNames: string[]) => {
    setFilters(s => ({
      ...s,
      riverBasinNames: riverBasinNames
    }));
  }

  useEffect(() => {
    let visible = [...allWaterRightsLayers];
    if ((filters.riverBasinNames?.length ?? 0) > 0) visible.push(waterRightsRiverBasinLayer);
    if (isNldiMapActive === true) visible.push(...nldiLayer);

    setVisibleLayers(visible);
  }, [filters.riverBasinNames, setVisibleLayers, isNldiMapActive])

  useEffect(() => {
    setGeoJsonData("river-basins", riverBasinPolygons ?? {
      "type": "FeatureCollection",
      "features": []
    });
  }, [riverBasinPolygons, setGeoJsonData])

  const handleFlowChange = useDebounceCallback((min: number | undefined, max: number | undefined) => {
    setFilters(s => ({
      ...s,
      minFlow: min,
      maxFlow: max
    }));
  }, 400)

  const handleVolumeChange = useDebounceCallback((min: number | undefined, max: number | undefined) => {
    setFilters(s => ({
      ...s,
      minVolume: min,
      maxVolume: max
    }));
  }, 400)

  const handlePriorityDateChange = useDebounceCallback((min: number | undefined, max: number | undefined) => {
    setFilters(s => ({
      ...s,
      minPriorityDate: min,
      maxPriorityDate: max
    }));
  }, 400)

  useEffect(() => {
    const buildRangeFilter = (includeNulls: boolean, field: waterRightsProperties.minFlowRate | waterRightsProperties.maxFlowRate | waterRightsProperties.minVolume | waterRightsProperties.maxVolume | waterRightsProperties.minPriorityDate | waterRightsProperties.maxPriorityDate, value: number): any[] => {
      const isMin = field === waterRightsProperties.minFlowRate || field === waterRightsProperties.minVolume || field === waterRightsProperties.minPriorityDate;
      const fieldStr = field as string;
      const operator = isMin ? "<=" : ">=";

      let coalesceValue;
      if ((includeNulls && isMin) || (!includeNulls && !isMin)) {
        coalesceValue = 999999999999
      } else {
        coalesceValue = -999999999999
      }
      return [operator, value, ["coalesce", ["get", fieldStr], coalesceValue]];
    }

    if (!allBeneficialUses || !allOwnerClassifications || !allWaterSourceTypes || !allStates || !allRiverBasinOptions) return;
    const filterSet = ["all"] as any[];
    if (filters.podPou === "POD" || filters.podPou === "POU") {
      filterSet.push(["==", ["get", waterRightsProperties.sitePodOrPou], filters.podPou]);
    }
    if (filters.includeExempt !== undefined) {
      filterSet.push(["==", ["get", waterRightsProperties.exemptOfVolumeFlowPriority], filters.includeExempt]);
    }
    if (filters.beneficialUses && filters.beneficialUses.length > 0 && filters.beneficialUses.length !== allBeneficialUses.length) {
      filterSet.push(["any", ...filters.beneficialUses.map(a => ["in", a.beneficialUseName, ["get", waterRightsProperties.beneficialUses]])]);
    }
    if (filters.ownerClassifications && filters.ownerClassifications.length > 0 && filters.ownerClassifications.length !== allOwnerClassifications.length) {
      filterSet.push(["any", ...filters.ownerClassifications.map(a => ["in", a, ["get", waterRightsProperties.ownerClassifications]])]);
    }
    if (filters.waterSourceTypes && filters.waterSourceTypes.length > 0 && filters.waterSourceTypes.length !== allWaterSourceTypes.length) {
      filterSet.push(["any", ...filters.waterSourceTypes.map(a => ["in", a, ["get", waterRightsProperties.waterSourceTypes]])]);
    }
    if (riverBasinPolygons && riverBasinPolygons.features) {
      filterSet.push(["any", ...riverBasinPolygons.features.map(a => ["within", a])]);
    }
    if (filters.states && filters.states.length > 0 && filters.states.length !== allStates.length) {
      filterSet.push(["any", ...filters.states.map(a => ["in", a, ["get", waterRightsProperties.states]])]);
    }
    if (filters.allocationOwner && filters.allocationOwner.length > 0) {
      filterSet.push(["in", filters.allocationOwner.toUpperCase(), ["upcase", ["get", waterRightsProperties.owners]]])
    }
    if (filters.maxFlow !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.maxFlowRate, filters.maxFlow));
    }
    if (filters.minFlow !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.minFlowRate, filters.minFlow));
    }
    if (filters.maxVolume !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.maxVolume, filters.maxVolume));
    }
    if (filters.minVolume !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.minVolume, filters.minVolume));
    }
    if (filters.minPriorityDate !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.minPriorityDate, filters.minPriorityDate));
    }
    if (filters.maxPriorityDate !== undefined) {
      filterSet.push(buildRangeFilter(false, waterRightsProperties.maxPriorityDate, filters.maxPriorityDate));
    }
    if (filters.polyline && filters.polyline.length > 0) {
      filterSet.push(["any", ...filters.polyline.map(a => ["within", a.data])]);
    }
    if (isNldiMapActive && nldiWadeSiteIds !== undefined) {
      filterSet.push(["in", ["get", waterRightsProperties.siteUuid], ["literal", nldiWadeSiteIds]]);
    }

    setMapLayerFilters(allWaterRightsLayers.map(a => {
      return { layer: a, filter: filterSet }
    }))
  }, [filters, setMapLayerFilters, allBeneficialUses, allOwnerClassifications, allWaterSourceTypes, allStates, allRiverBasinOptions, riverBasinPolygons, isNldiMapActive, nldiWadeSiteIds])

  const clearMapFilters = () => {
    setFilters(defaultFilters);
    setDisplayOptions({ ...defaultDisplayOptions });
    setAllocationOwnerValue("");
    polylines.forEach(a => {
      setPolylines(a.identifier, null);
    })
    setNldiMapStatus(false);
  }

  useProgressIndicator([!isAllBeneficialUsesLoading, !isAllWaterSourceTypesLoading, !isAllOwnerClassificationsLoading, !isAllStatesLoading, !isRiverBasinOptionsLoading, !isRiverBasinPolygonsLoading], "Loading Filter Data");
  useWaterRightsMapPopup();
  useWaterRightMapPointScaling(displayOptions.pointSize, filters);

  const isLoading = useMemo(() => {
    return isAllBeneficialUsesLoading || isAllWaterSourceTypesLoading || isAllOwnerClassificationsLoading || isAllStatesLoading || isRiverBasinOptionsLoading;
  }, [isAllBeneficialUsesLoading, isAllWaterSourceTypesLoading, isAllOwnerClassificationsLoading, isAllStatesLoading, isRiverBasinOptionsLoading])

  const isError = useMemo(() => {
    return isAllBeneficialUsesError || isAllWaterSourceTypesError || isAllOwnerClassificationsError || isAllStatesError;
  }, [isAllBeneficialUsesError, isAllWaterSourceTypesError, isAllOwnerClassificationsError, isAllStatesError])

  useMapErrorAlert(isError);
  useNoMapResults(!hasRenderedFeatures);

  if (isLoading) return null;

  if (isError) return null;

  return (
    <>
      <div className="map-info text-center p-2">
        {renderedFeatures.length} Points of Diversions Displayed
      </div>
      <div className="m-3">
        <Button variant="outline-danger" className="w-100" onClick={clearMapFilters}>
          Reset All Filters
        </Button>
      </div>
      <div className="position-relative flex-grow-1 panel-content">

        <Accordion flush defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>COLOR AND SIZE TOOLS</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <label>Change Map Color Legend</label>
                <Select
                  options={mapColorLegendOptions}
                  onChange={a => handleMapGroupingChange(a?.value)}
                  name="mapColorLegend"
                  value={mapColorLegendOptions.find(x => x.value === displayOptions.mapGrouping)}
                />
              </div>

              <div className="mb-3">
                <label>Toggle Point Size</label>
                <ButtonGroup className="w-100">
                  {pointSizeRadios.map((radio) => (<ToggleButton
                    className="zindexzero"
                    key={radio.value}
                    id={`pointSizeRadio-${radio.value}`}
                    type="radio"
                    variant="outline-primary"
                    name="pointSizeRadio"
                    value={radio.value}
                    checked={displayOptions.pointSize === radio.value}
                    onChange={handlePointSizeChange}
                  >
                    {radio.name}
                  </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>

              <div className="mb-3">
                <label>Map Layer</label>
                <MapThemeSelector />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>SITE SELECTION FILTERS</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <a href="https://westernstateswater.org/wade/westdaat-filter-documentation/" target="_blank" rel="noopener noreferrer">Learn about WestDAAT filters</a>
              </div>
              <div className="mb-3">
                <label>State</label>
                <Select
                  isMulti
                  options={allStates?.map(state => ({ value: state }))}
                  onChange={a => handleStateChange(a.map(option => option.value))}
                  closeMenuOnSelect={false}
                  placeholder="Select State(s)"
                  name="states"
                  getOptionLabel={(option) => option.value}
                  value={filters.states?.map(state => ({ value: state }))} />
              </div>
              <div className="mb-3">
                <label>Beneficial Use</label>

                <BeneficialUseSelect
                  selectedOptions={filters.beneficialUses}
                  options={allBeneficialUses}
                  onChange={handleBeneficialUseChange}
                />
              </div>
              <div className="mb-3">
                <label>Water Source Type</label>
                <Select
                  isMulti
                  options={allWaterSourceTypes?.map(waterSourceType => ({ value: waterSourceType }))}
                  onChange={a => handleWaterSourceTypeChange(a.map(option => option.value))}
                  closeMenuOnSelect={false}
                  placeholder="Select Water Source Type(s)"
                  name="waterSourceTypes"
                  getOptionLabel={(option) => option.value}
                  value={filters.waterSourceTypes?.map(waterSourceType => ({ value: waterSourceType }))} />
              </div>

              <div className="mb-3">
                <label>Search Allocation Owner</label>
                <input type="text" className="form-control" onChange={handleAllocationOwnerChange} value={allocationOwnerValue} />
              </div>

              <div className="mb-3">
                <label>Owner Classification Type</label>
                <Select
                  isMulti
                  options={allOwnerClassifications?.map(ownerClassification => ({ value: ownerClassification }))}
                  onChange={a => handleOwnerClassificationChange(a.map(option => option.value))}
                  closeMenuOnSelect={false}
                  placeholder="Select Owner Classification(s)"
                  name="ownerClassification"
                  getOptionLabel={(option) => option.value}
                  value={filters.ownerClassifications?.map(ownerClassification => ({ value: ownerClassification }))} />
              </div>
              <div className="mb-3">
                <label>River Basin Area</label>
                <Select
                  isMulti
                  options={allRiverBasinOptions?.map(riverBasin => ({ value: riverBasin }))}
                  onChange={a => handleRiverBasinChange(a.map(option => option.value))}
                  closeMenuOnSelect={false}
                  placeholder="Select Sites in River Basin(s)"
                  name="riverBasins"
                  getOptionLabel={(option) => option.value}
                  value={filters.riverBasinNames?.map(riverBasin => ({ value: riverBasin }))} />
              </div>
              <div className="mb-3">
                <label>Toggle View</label>
                <ButtonGroup className="w-100">
                  {podPouRadios.map((radio, idx) => (
                    <ToggleButton
                      className="zindexzero"
                      key={idx}
                      id={`podPouRadio-${idx}`}
                      type="radio"
                      variant="outline-primary"
                      name="podPouRadio"
                      value={radio.value}
                      checked={(filters.podPou ?? '') === radio.value}
                      onChange={handlePodPouChange}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
              <div className="mb-3">
                <label>Site Content</label>
                <ButtonGroup className="w-100">
                  {exemptRadios.map((radio) => (<ToggleButton
                    className="zindexzero"

                    key={radio.value}
                    id={`exemptRadio-${radio.value}`}
                    type="radio"
                    variant="outline-primary"
                    name="exemptRadio"
                    value={radio.value ?? ''}
                    checked={exemptMapping.get(filters.includeExempt) === radio.value}
                    onChange={handleExemptChange}
                  >
                    {radio.name}
                  </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>

              <div className="mb-3">
                <label>Priority Date</label>
                <PriorityDateRange onChange={handlePriorityDateChange} initialMin={filters.minPriorityDate} initialMax={filters.maxPriorityDate} />
              </div>
              <div className="mb-3">
                <label>Flow Range (CFS)</label>
                <FlowRangeSlider onChange={handleFlowChange} initialMin={filters.minFlow} initialMax={filters.maxFlow} />
              </div>

              <div className="mb-3">
                <label>Volume Range (AF)</label>
                <VolumeRange onChange={handleVolumeChange} initialMin={filters.minVolume} initialMax={filters.maxVolume} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header onClick={() => setNldiMapStatus(!isNldiMapActive)}>
              <label className="fw-bold">NLDI MAP {isNldiMapActive}</label>
              <div className="px-5">
                <BootstrapSwitchButton checked={isNldiMapActive} onstyle="primary" offstyle="secondary" />
              </div>
            </Accordion.Header>
            <Accordion.Body >
              <NldiTab />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

    </>
  );
}

export default WaterRightsTab;

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
      setLayerCircleRadii({ layer: waterRightsPointsLayer, circleRadius: defaultPointCircleRadius })
    } else {
      if (min === max) {
        setLayerCircleRadii({ layer: waterRightsPointsLayer, circleRadius: defaultPointCircleRadius })
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
      setLayerCircleRadii({ layer: waterRightsPointsLayer, circleRadius: ["interpolate", ["linear"], ["zoom"], pointSizes.minPointSizeZoomLevel, minZoomValue, pointSizes.maxPointSizeZoomLevel, maxZoomValue] })
    }
  }, [pointSize, scaleProperty, min, max, setLayerCircleRadii])

  useEffect(() => {
    if (pointSize === "f") {
      setLayerCircleSortKeys({ layer: waterRightsPointsLayer, circleSortKey: flowPointCircleSortKey })
    } else if (pointSize === "v") {
      setLayerCircleSortKeys({ layer: waterRightsPointsLayer, circleSortKey: volumePointCircleSortKey })
    } else {
      setLayerCircleSortKeys({ layer: waterRightsPointsLayer, circleSortKey: defaultPointCircleSortKey })
    }
  }, [pointSize, setLayerCircleSortKeys])
}