import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRange";
import { MapContext } from "./MapProvider";
import VolumeRange from "./VolumeRange";
import { AppContext } from "../AppProvider";
import { MapThemeSelector } from "./MapThemeSelector";
import deepEqual from 'fast-deep-equal/es6';
import { useQuery } from "react-query";
import { getBeneficialUses, getOwnerClassifications, getWaterSourceTypes } from "../accessors/systemAccessor";
import useProgressIndicator from "../hooks/useProgressIndicator";
import { useDebounceCallback } from "@react-hook/debounce";
import useNoMapResults from "../hooks/useNoMapResults";
import { PriorityDateRange } from "./PriorityDateRange";


enum waterRightsProperties {
  owners = "o",
  ownerClassifications = "oClass",
  beneficialUses = "bu",
  siteUuid = "uuid",
  sitePodOrPou = "podPou",
  waterSourceTypes = "wsType",
  minFlowRate = "minFlow",
  maxFlowRate = "maxFlow",
  minVolume = "minVol",
  maxVolume = "maxVol",
  minPriorityDate = "minPri",
  maxPriorityDate = "maxPri",
}

enum MapGrouping {
  BeneficialUse = "bu",
  OwnerClassification = "oClass",
  WaterSourceType = "wsType"
}

interface WaterRightsFilters {
  beneficialUses?: string[],
  ownerClassifications?: string[],
  waterSourceTypes?: string[],
  allocationOwner?: string,
  mapGrouping: MapGrouping,
  includeNulls: boolean,
  minFlow: number | undefined,
  maxFlow: number | undefined,
  minVolume: number | undefined,
  maxVolume: number | undefined,
  podPou: "POD" | "POU" | undefined,
  minPriorityDate: number | undefined,
  maxPriorityDate: number | undefined
}

const mapDataTiers = [
  'https://api.maptiler.com/tiles/1e068efa-3cd5-4509-a1aa-286c135fc85c/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/61b00cf0-537e-456c-9d6c-ad1d4a8ec597/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/c03b0c46-b9c3-4574-8498-cbebca00b871/tiles.json?key=IauIQDaqjd29nJc5kJse',
  'https://api.maptiler.com/tiles/6d61092a-7c8a-4cd1-8272-d92cf019730c/tiles.json?key=IauIQDaqjd29nJc5kJse'
]

const colors = [
  '#006400',
  '#9ACD32',
  '#FF00E6',
  '#0000FF',
  '#32CD32',
  '#FF4500',
  '#9370DB',
  '#00FFFF',
  '#FF69B4',
  '#800080',
  '#00BFFF',
  '#FFD700',
  '#A52A2A',
  '#4B0082',
  '#808080',
  '#FFA500',
  '#D2691E',
  '#FFC0CB',
  '#F0FFF0',
  '#F5DEB3',
  '#FF0000'
]

const waterRightsPointsLayer = 'waterRightsPoints';
const waterRightsPolygonsLayer = 'waterRightsPolygons';

const allWaterRightsLayers = [
  waterRightsPointsLayer,
  waterRightsPolygonsLayer
]

const defaultFilters: WaterRightsFilters = {
  beneficialUses: undefined,
  ownerClassifications: undefined,
  allocationOwner: undefined,
  waterSourceTypes: undefined,
  mapGrouping: MapGrouping.BeneficialUse,
  includeNulls: false,
  minFlow: undefined,
  maxFlow: undefined,
  minVolume: undefined,
  maxVolume: undefined,
  podPou: undefined,
  minPriorityDate: undefined,
  maxPriorityDate: undefined
}

function WaterRightsTab() {
  const { data: allBeneficialUses, isFetching: isAllBeneficialUsesLoading } = useQuery(
    ['beneficialUses'],
    getBeneficialUses,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    })

  const { data: allWaterSourceTypes, isFetching: isAllWaterSourceTypesLoading } = useQuery(
    ['waterSourceTypes'],
    getWaterSourceTypes,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    })

  const { data: allOwnerClassifications, isFetching: isAllOwnerClassificationsLoading } = useQuery(
    ['ownerClassifications'],
    getOwnerClassifications,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    })

  useProgressIndicator([!isAllBeneficialUsesLoading, !isAllWaterSourceTypesLoading, !isAllOwnerClassificationsLoading], "Loading Filter Data");

  const { setUrlParam, getUrlParam } = useContext(AppContext);

  const [filters, setFilters] = useState<WaterRightsFilters>(getUrlParam<WaterRightsFilters>("wr") ?? defaultFilters);

  const mapGrouping = useMemo(() => {
    let colorIndex = 0;
    let colorMapping: { key: string, color: string }[];
    switch (filters.mapGrouping) {
      case MapGrouping.BeneficialUse:
        colorMapping = allBeneficialUses?.map(a => ({ key: a, color: colors[colorIndex++ % colors.length] })) ?? []
        break;
      case MapGrouping.OwnerClassification:
        colorMapping = allOwnerClassifications?.map(a => ({ key: a, color: colors[colorIndex++ % colors.length] })) ?? []
        break;
      case MapGrouping.WaterSourceType:
        colorMapping = allWaterSourceTypes?.map(a => ({ key: a, color: colors[colorIndex++ % colors.length] })) ?? []
        break;
    }
    return { property: filters.mapGrouping as string, colorMapping }
  }, [filters.mapGrouping, allBeneficialUses, allWaterSourceTypes, allOwnerClassifications])

  const radios = [
    { name: 'Both', value: '' },
    { name: 'POD', value: 'POD' },
    { name: 'POU', value: 'POU' },
  ];

  const {
    setLegend,
    setLayerFilters: setMapLayerFilters,
    setVisibleLayers,
    renderedFeatures,
    setLayerCircleColors,
    setLayerFillColors,
    setVectorUrl
  } = useContext(MapContext);

  useEffect(() => {
    let params = (new URL(document.location.href)).searchParams;
    let tier = parseInt(params.get("tier") ?? "");
    if (!isNaN(tier) && tier >= 0 && tier < mapDataTiers.length) {
      setVectorUrl('allocation-sites_1', mapDataTiers[tier])
    }
  }, [setVectorUrl])

  const renderedMapGroupings = useMemo(() => {
    let colorMappings = [...mapGrouping.colorMapping];
    if (mapGrouping.property === MapGrouping.BeneficialUse as string && filters.beneficialUses && filters.beneficialUses.length > 0) {
      colorMappings = colorMappings.filter(a => filters.beneficialUses?.some(b => b === a.key));
    }
    if (mapGrouping.property === MapGrouping.WaterSourceType as string && filters.waterSourceTypes && filters.waterSourceTypes.length > 0) {
      colorMappings = colorMappings.filter(a => filters.waterSourceTypes?.some(b => b === a.key));
    }
    if (mapGrouping.property === MapGrouping.OwnerClassification as string && filters.ownerClassifications && filters.ownerClassifications.length > 0) {
      colorMappings = colorMappings.filter(a => filters.ownerClassifications?.some(b => b === a.key));
    }
    colorMappings = colorMappings.filter(a => renderedFeatures.some(b => b.properties && JSON.parse(b.properties[mapGrouping.property]).some((c: string) => c === a.key)));
    return {
      property: mapGrouping.property,
      colorMapping: colorMappings
    }
  }, [mapGrouping, renderedFeatures, filters.beneficialUses, filters.waterSourceTypes, filters.ownerClassifications])

  useEffect(() => {
    let colorArray: any;
    if (renderedMapGroupings.colorMapping.length > 0) {
      colorArray = ["case"];
      renderedMapGroupings.colorMapping.forEach(a => {
        colorArray.push(["in", a.key, ["get", renderedMapGroupings.property]]);
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
  }, [setLayerCircleColors, setLayerFillColors, renderedMapGroupings])

  useEffect(() => {
    if (renderedMapGroupings.colorMapping.length === 0) {
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
        </>);
    }
  }, [setLegend, renderedMapGroupings])

  const [allocationOwnerValue, setAllocationOwnerValue] = useState(filters.allocationOwner ?? "")

  useEffect(() => {
    setVisibleLayers(allWaterRightsLayers)
  }, [setVisibleLayers])

  const hasRenderedFeatures = useMemo(() => renderedFeatures.length > 0, [renderedFeatures.length]);
  useNoMapResults(hasRenderedFeatures);

  useEffect(() => {
    if (deepEqual(filters, defaultFilters)) {
      setUrlParam("wr", undefined);
    } else {
      setUrlParam("wr", filters);
    }
  }, [filters, setUrlParam])

  const handleMapGroupingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters(s => ({
      ...s,
      mapGrouping: e.target.value as MapGrouping
    }));
  }

  const handlePodPouChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(s => ({
      ...s,
      podPou: e.target.value === "POD" || e.target.value === "POU" ? e.target.value : undefined
    }));
  }

  const handleBeneficialUseChange = (selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      beneficialUses: selectedOptions.length > 0 ? selectedOptions : undefined
    }));
  }

  const handleOwnerClassificationChange = (selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      ownerClassifications: selectedOptions.length > 0 ? selectedOptions : undefined
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
      waterSourceTypes: selectedOptions.length > 0 ? selectedOptions : undefined
    }));
  }

  const handleIncludeNullChange = useDebounceCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilters(s => ({
      ...s,
      includeNulls: e.target.checked
    }));
  }, 400)

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
    if (!allBeneficialUses || !allOwnerClassifications || !allWaterSourceTypes) return;
    const filterSet = ["all"] as any[];
    if (filters.podPou === "POD" || filters.podPou === "POU") {
      filterSet.push(["==", ["get", waterRightsProperties.sitePodOrPou], filters.podPou]);
    }
    if (filters.beneficialUses && filters.beneficialUses.length > 0 && filters.beneficialUses.length !== allBeneficialUses.length) {
      filterSet.push(["any", ...filters.beneficialUses.map(a => ["in", a, ["get", waterRightsProperties.beneficialUses]])]);
    }
    if (filters.ownerClassifications && filters.ownerClassifications.length > 0 && filters.ownerClassifications.length !== allOwnerClassifications.length) {
      filterSet.push(["any", ...filters.ownerClassifications.map(a => ["in", a, ["get", waterRightsProperties.ownerClassifications]])]);
    }
    if (filters.waterSourceTypes && filters.waterSourceTypes.length > 0 && filters.waterSourceTypes.length !== allWaterSourceTypes.length) {
      filterSet.push(["any", ...filters.waterSourceTypes.map(a => ["in", a, ["get", waterRightsProperties.waterSourceTypes]])]);
    }
    if (filters.allocationOwner && filters.allocationOwner.length > 0) {
      filterSet.push(["in", filters.allocationOwner.toUpperCase(), ["upcase", ["get", waterRightsProperties.owners]]])
    }
    if (filters.maxFlow !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.maxFlowRate, filters.maxFlow));
    }
    if (filters.minFlow !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.minFlowRate, filters.minFlow));
    }
    if (filters.maxVolume !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.maxVolume, filters.maxVolume));
    }
    if (filters.minVolume !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.minVolume, filters.minVolume));
    }
    if (filters.minPriorityDate !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.minPriorityDate, filters.minPriorityDate));
    }
    if (filters.maxPriorityDate !== undefined) {
      filterSet.push(buildRangeFilter(filters.includeNulls, waterRightsProperties.maxPriorityDate, filters.maxPriorityDate));
    }

    setMapLayerFilters(allWaterRightsLayers.map(a => {
      return { layer: a, filter: filterSet }
    }))
  }, [filters, setMapLayerFilters, allBeneficialUses, allOwnerClassifications, allWaterSourceTypes])

  const clearMapFilters = () => {
    setFilters({ ...defaultFilters });
    setAllocationOwnerValue("");
  }

  if (isAllBeneficialUsesLoading || isAllWaterSourceTypesLoading || isAllOwnerClassificationsLoading) return null;

  return (
    <>
      <div className="map-info text-center p-2">
        {renderedFeatures.length} Points of Diversions Displayed
      </div>
      <div className="position-relative flex-grow-1">
        <div className="panel-content p-3">
          <div className="mb-3">
            <label>FILTERS</label>
            <a href="/filters" target="_blank">Learn about WaDE filters</a>
          </div>

          <div className="mb-3">
            <label>TOGGLE VIEW</label>
            <ButtonGroup className="w-100">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="outline-primary"
                  name="radio"
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
            <label>Change Map Legend</label>
            <select className="form-select" onChange={handleMapGroupingChange} value={filters.mapGrouping}>
              <option value={MapGrouping.BeneficialUse}>Beneficial Use</option>
              <option value={MapGrouping.OwnerClassification}>Owner Classification</option>
              <option value={MapGrouping.WaterSourceType}>Water Source Type</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Search Allocation Owner</label>
            <input type="text" className="form-control" onChange={handleAllocationOwnerChange} value={allocationOwnerValue} />
          </div>

          <div className="mb-3">
            <label>Owner Classification</label>
            <DropdownMultiselect
              className="form-control"
              options={allOwnerClassifications}
              selected={filters.ownerClassifications ?? []}
              handleOnChange={handleOwnerClassificationChange}
              name="ownerClassification"
            />
          </div>

          <div className="mb-3">
            <label>Beneficial Use</label>
            <DropdownMultiselect
              className="form-control"
              options={allBeneficialUses}
              selected={filters.beneficialUses ?? []}
              handleOnChange={handleBeneficialUseChange}
              name="beneficialUses"
            />
          </div>

          <div className="mb-3">
            <label>Water Source Type</label>
            <DropdownMultiselect
              className="form-control"
              options={allWaterSourceTypes}
              selected={filters.waterSourceTypes ?? []}
              handleOnChange={handleWaterSourceTypeChange}
              name="beneficialUses"
            />
          </div>

          <div className="mb-3 form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" defaultChecked={filters.includeNulls} onChange={handleIncludeNullChange} />
            <label className="form-check-label">Include Empty Amount and Priority Date Value</label>
          </div>

          <div className="mb-3">
            <label>Flow Range (CFS)</label>
            <FlowRangeSlider onChange={handleFlowChange} initialMin={filters.minFlow} initialMax={filters.maxFlow} />
          </div>

          <div className="mb-3">
            <label>Volume Range (AF)</label>
            <VolumeRange onChange={handleVolumeChange} initialMin={filters.minVolume} initialMax={filters.maxVolume} />
          </div>

          <div className="mb-3">
            <label>Priority Date</label>
            <PriorityDateRange onChange={handlePriorityDateChange} initialMin={filters.minPriorityDate} initialMax={filters.maxPriorityDate} />
          </div>

          <div className="mb-3">
            <label>MAP THEME</label>
            <MapThemeSelector />
          </div>

          <div className="mt-4">
            <Button className="w-100" onClick={clearMapFilters}>
              Reset All Filters
            </Button>
          </div>
        </div>
      </div>

    </>
  );
}

export default WaterRightsTab;


