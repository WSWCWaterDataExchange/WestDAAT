import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
import { waterRightsProperties } from "../config/constants";
import { useBeneficialUses, useOwnerClassifications, useStates, useWaterSourceTypes } from "../hooks/useSystemQuery";
import { mapLayerNames } from "../config/maps";
import { useRiverBasinOptions } from '../hooks';
import { getRiverBasinPolygonsByName } from '../accessors/systemAccessor';
import { useQuery } from 'react-query';
import { Accordion } from "react-bootstrap";
import '../App.scss';
import BeneficialUseSelect from "./BeneficialUseSelect";
import { BeneficialUseListItem } from "../data-contracts/BeneficialUseListItem";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { FeatureCollection } from "geojson";
import { DataPoints, Directions } from "../data-contracts/nldi";
import Select from "react-select";
import { FilterContext, NldiFilters, defaultFilters, defaultNldiFilters } from "../FilterProvider";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import useNldiMapPopup from "../hooks/map-popups/useNldiMapPopup";
import useWaterRightDigestMapPopup from "../hooks/map-popups/useWaterRightDigestMapPopup";
import NldiTab from "./NldiTab";
import useNldiMapFiltering from "../hooks/useNldiMapFiltering";
import { MapGrouping, useWaterRightsDisplayOptions } from "../hooks/useWaterRightsDisplayOptions";

const mapColorLegendOptions = [
  { value: MapGrouping.BeneficialUse, label: 'Beneficial Use' },
  { value: MapGrouping.OwnerClassification, label: 'Owner Classification' },
  { value: MapGrouping.WaterSourceType, label: 'Water Source Type' }
];

const nldiLayer = [
  mapLayerNames.nldiFlowlinesLayer,
  mapLayerNames.nldiUsgsLocationLayer,
  mapLayerNames.nldiUsgsPointsLayer
];

const allWaterRightsLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer
]

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
  const { filters, setFilters, setNldiIds } = useContext(FilterContext);
  const { data: riverBasinPolygons, isFetching: isRiverBasinPolygonsLoading } = useQuery(['riverBasinPolygonsByName', filters.riverBasinNames ?? []], async (): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined> => {
    if ((filters?.riverBasinNames?.length ?? 0) === 0) {
      return undefined;
    }
    return await getRiverBasinPolygonsByName(filters?.riverBasinNames ?? []);
  }, { keepPreviousData: true });

  const {
    setLayerFilters: setMapLayerFilters,
    setVisibleLayers,
    polylines,
    setPolylines,
    geoJsonData,
    setGeoJsonData
  } = useContext(MapContext);

  const [isNldiMapActive, setNldiMapStatus] = useState<boolean>(getUrlParam("nldiActive") ?? false);
  const [activeKeys, setActiveKeys] = useState<AccordionEventKey>(isNldiMapActive ? ["nldi"] : ["colorSizeTools", "siteSelectionFilters"]);
  const {displayOptions, setMapGrouping, setPointSize, resetDisplayOptions} = useWaterRightsDisplayOptions(filters, allBeneficialUses, allOwnerClassifications, allWaterSourceTypes);

  useEffect(() => {
    for (let element of filters.polyline) {
      setPolylines(element.identifier, element.data);
    }
  }, [setPolylines])/* eslint-disable-line *//* we don't want to run multiple times thats why we don't add the filters.polyline */

  useEffect(() => {
    setFilters((s) => ({
      ...s,
      polyline: polylines
    }))
  }, [setFilters, polylines])

  const [allocationOwnerValue, setAllocationOwnerValue] = useState(filters.allocationOwner ?? "");
  const nldiWadeSiteIds = useMemo(() => {
    const nldiFilterData = filters.nldiFilterData;
    if (!isNldiMapActive || !nldiFilterData || !(nldiFilterData.dataPoints & DataPoints.Wade)) {
      return [];
    }
    let nldiData = geoJsonData.filter(s => s.source === 'nldi');
    if (nldiData && nldiData.length > 0) {
      let arr = (nldiData[0].data as FeatureCollection).features
        .filter(x => x.properties?.westdaat_pointdatasource?.toLowerCase() === 'wade' || x.properties?.source?.toLowerCase() === 'wade');

      if ((nldiFilterData?.directions & Directions.Upsteam) && !(nldiFilterData?.directions & Directions.Downsteam)) {
        arr = arr.filter(x => x.properties?.westdaat_direction === 'Upstream');
      } else if (!(nldiFilterData?.directions & Directions.Upsteam) && (nldiFilterData?.directions & Directions.Downsteam)) {
        arr = arr.filter(x => x.properties?.westdaat_direction === 'Downstream');
      } else if (!(nldiFilterData?.directions & Directions.Upsteam) && !(nldiFilterData?.directions & Directions.Downsteam)) {
        return [];
      }
      return arr.filter(x => x.properties?.identifier !== null && x.properties?.identifier !== undefined)
        .map(a => a.properties?.identifier);
    } else { // if nldi is not active, empty the array
      return [];
    }
  }, [geoJsonData, filters.nldiFilterData, isNldiMapActive]);

  useEffect(() => {
    setNldiIds(previousState => {
      if (deepEqual(previousState, nldiWadeSiteIds)) {
        return previousState;
      }
      return nldiWadeSiteIds;
    });
  }, [nldiWadeSiteIds, setNldiIds]);

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

  const handleMapGroupingChange = (mapGroupingOption: MapGrouping | undefined) => {
    setMapGrouping(mapGroupingOption);
  }

  const handlePointSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPointSize(e.target.value);
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

  const toggleNldiFilterStatus = useCallback(() => {
    if(isNldiMapActive)
    {
      setNldiMapStatus(false);
    } else {
      setNldiMapStatus(true);
      setFilters(s => ({
        ...s,
        nldiFilterData: s.nldiFilterData ?? defaultNldiFilters
      }))
    }
  }, [isNldiMapActive, setFilters, setNldiMapStatus]);

  const handleNldiFilterChange = async (nldiFilters: Partial<NldiFilters>) => {
    setFilters(s => {
      const filterData = s.nldiFilterData || defaultNldiFilters;
      return {
          ...s,
          nldiFilterData: {
            ...filterData,
            ...nldiFilters
          }
        }
    });
  }

  useEffect(() => {
    let visible = [...allWaterRightsLayers];
    if ((filters.riverBasinNames?.length ?? 0) > 0) visible.push(mapLayerNames.riverBasinsLayer);
    if (isNldiMapActive === true) visible.push(...nldiLayer);

    setVisibleLayers(visible);
  }, [filters.riverBasinNames, setVisibleLayers, isNldiMapActive])

  useEffect(() => {
    setGeoJsonData(mapLayerNames.riverBasinsLayer, riverBasinPolygons ?? {
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
    resetDisplayOptions();
    setAllocationOwnerValue("");
    polylines.forEach(a => {
      setPolylines(a.identifier, null);
    })
    setNldiMapStatus(false);
    setActiveKeys(["colorSizeTools", "siteSelectionFilters"]);
  }

  useProgressIndicator([!isAllBeneficialUsesLoading, !isAllWaterSourceTypesLoading, !isAllOwnerClassificationsLoading, !isAllStatesLoading, !isRiverBasinOptionsLoading, !isRiverBasinPolygonsLoading], "Loading Filter Data");
  const [isNldiDataFetching] = useNldiMapFiltering(filters.nldiFilterData);
  useNldiMapPopup();
  useWaterRightDigestMapPopup();

  const isLoading = useMemo(() => {
    return isAllBeneficialUsesLoading || isAllWaterSourceTypesLoading || isAllOwnerClassificationsLoading || isAllStatesLoading || isRiverBasinOptionsLoading;
  }, [isAllBeneficialUsesLoading, isAllWaterSourceTypesLoading, isAllOwnerClassificationsLoading, isAllStatesLoading, isRiverBasinOptionsLoading])

  useEffect(() => {
    if (isNldiMapActive) {
      setUrlParam("nldiActive", isNldiMapActive);
    } else {
      setUrlParam("nldiActive", undefined);
    }
  }, [setNldiMapStatus, isNldiMapActive, setUrlParam])

  const isError = useMemo(() => {
    return isAllBeneficialUsesError || isAllWaterSourceTypesError || isAllOwnerClassificationsError || isAllStatesError;
  }, [isAllBeneficialUsesError, isAllWaterSourceTypesError, isAllOwnerClassificationsError, isAllStatesError])

  useMapErrorAlert(isError);
  useNoMapResults(!isLoading && !isNldiDataFetching);

  if (isLoading) return null;

  if (isError) return null;

  return (
    <>
      <div className="m-3">
        <Button variant="outline-danger" className="w-100" onClick={clearMapFilters}>
          Reset All Filters
        </Button>
      </div>
      <div className="position-relative flex-grow-1 panel-content">

        <Accordion flush activeKey={activeKeys} alwaysOpen onSelect={(e) => setActiveKeys(e)}>
          <Accordion.Item eventKey="colorSizeTools">
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
                <label>Map Layer</label>
                <MapThemeSelector />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="siteSelectionFilters">
            <Accordion.Header>WATER RIGHT SELECTION FILTERS</Accordion.Header>
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
          <Accordion.Item eventKey="nldi">
            <Accordion.Header onClick={toggleNldiFilterStatus}>
              <label className="fw-bold">NLDI FILTER {isNldiMapActive}</label>
              <div className="px-5">
                <BootstrapSwitchButton checked={isNldiMapActive} onstyle="primary" offstyle="secondary" />
              </div>
            </Accordion.Header>
            <div className="px-4" style={{background:"ghostwhite"}}>
              <a className="h6" target="_blank" rel="noreferrer" href="https://westernstateswater.org/wade/westdaat-nldi-geoconnex-documentation/">Learn About NLDI-Geoconnex filter here</a>
              <label className="h6"><i>Search along the stream network using the Hydro Network-Linked Data Index (NLDI) and Geoconnex Frameworks</i></label>
            </div>
            <Accordion.Body>
              {isNldiMapActive && <NldiTab nldiFilters={filters.nldiFilterData ?? defaultNldiFilters} setNldiFilters={handleNldiFilterChange} />}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

    </>
  );
}

export default WaterRightsTab;