import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRangeSlider";
import { MapContext } from "./MapProvider";
import BeneficialUseSelect, { BeneficialUseChangeOption } from "./BeneficialUseSelect";
import VolumeRangeSlider from "./VolumeRangeSlider";
import { ownerClassificationsList } from "../config/waterRights";
import { AppContext } from "../AppProvider";
import mapConfig from "../config/maps";
import { MapThemeSelector } from "./MapThemeSelector";

function WaterRightsTab() {
  const [radioValue, setRadioValue] = useState('1');
  const { setUrlParam, getUrlParam } = useContext(AppContext);

  const [filters, setFilters] = useState<WaterRightsFilters>(getUrlParam<WaterRightsFilters>("wr") ?? {});

  const allWaterRightsLayers = useMemo(() => [
    'agricultural',
    'aquaculture',
    'commercial',
    'domestic',
    'environmental',
    'fire',
    'fish',
    'flood',
    'heating',
    'industrial',
    'instream',
    'livestock',
    'mining',
    'municipal',
    'other',
    'power',
    'recharge',
    'recreation',
    'snow',
    'storage',
    'wildlife',
  ], []);

  interface WaterRightsFilters {
    beneficialUses?: string[],
    ownerClassifications?: string[]
  }

  const radios = [
    { name: 'Both', value: '1' },
    { name: 'POD', value: '2' },
    { name: 'POU', value: '3' },
  ];

  const {
    setLegend,
    setLayerFilters: setMapLayerFilters,
    setVisibleLayers
  } = useContext(MapContext);

  const convertLayersToBeneficialUseOptions = useCallback((beneficialUses: string[]) => {
    const convertMapLayerToBeneficialUseChangeOption = (layer: { id: string, friendlyName: string, paint: any }): BeneficialUseChangeOption => {
      return {
        value: layer.id,
        label: layer.friendlyName,
        color: layer.paint?.["circle-color"] as string
      }
    }

    return beneficialUses.map(a => {
      let layer = mapConfig.layers.find(b => b.id === a);
      if (layer) {
        return convertMapLayerToBeneficialUseChangeOption(layer as { id: string, friendlyName: string, paint: any });
      }
      return undefined;
    }).filter(a => a !== undefined) as BeneficialUseChangeOption[];
  }, []);

  const availableOptions = useMemo(() => {
    return convertLayersToBeneficialUseOptions(allWaterRightsLayers);
  }, [allWaterRightsLayers, convertLayersToBeneficialUseOptions]);

  useEffect(() => {
    setLegend(<>
      {
        //Sort legend items alphabetically
        availableOptions.map(layer => {
          return (
            <div key={layer.value} className="legend-item">
              <span className="legend-circle" style={{ "backgroundColor": layer.color }}></span>
              {layer.label}
            </div>
          );
        }
        )
      }
    </>);
  }, [setLegend, availableOptions])

  useEffect(() => {
    let visibleLayers = allWaterRightsLayers;
    if (filters.beneficialUses && filters.beneficialUses.length > 0) {
      visibleLayers = filters.beneficialUses;
    }
    setVisibleLayers(visibleLayers)
  }, [filters, allWaterRightsLayers, setVisibleLayers])

  useEffect(() => {
    if (!filters.ownerClassifications && !filters.beneficialUses) {
      setUrlParam("wr", undefined)
    }
    setUrlParam("wr", filters)
  }, [filters, setUrlParam])

  const handleBeneficialUseChange = useCallback((selectedOptions: BeneficialUseChangeOption[]) => {
    setFilters(s => ({
      ...s,
      beneficialUses: selectedOptions.length > 0 ? selectedOptions.map(a => a.value) : undefined
    }));
  }, [setFilters]);

  const handleOwnerClassificationChange = useCallback((selectedOptions: string[]) => {
    setFilters(s => ({
      ...s,
      ownerClassifications: selectedOptions.length > 0 ? selectedOptions : undefined
    }));
  }, [setFilters]);

  useEffect(() => {
    const filterSet = [] as any[];
    if (filters.ownerClassifications && filters.ownerClassifications.length > 0) {
      filterSet.push(["in", "ownerClassification", ...filters.ownerClassifications]);
    }
    setMapLayerFilters(allWaterRightsLayers.map(a => {
      return { layer: a, filter: ["all", ...filterSet] }
    }))
  }, [filters, allWaterRightsLayers, setMapLayerFilters])

  // const handleAllocationDateChange = (dates: ReadonlyArray<number>) => {
  //   // milliseconds since 1970 (can be negative)
  //   const startDate = new Date(dates[0], 0).getTime();
  //   const endDate = new Date(dates[1], 11, 31, 23, 59).getTime();

  //   var filter: any = [
  //     "all",
  //     [">=", "priorityDate", startDate],
  //     ["<=", "priorityDate", endDate]
  //   ];

  //   layers.forEach((layer) => {
  //     map?.setFilter(layer.id, filter);
  //   });

  //   setAllocationDateFilter(dates as number[]);
  // };

  // useEffect(() => {
  //   if (mapFilters.isLoaded && !hasAppliedFilters) {
  //     map?.once("styledata", () => {
  //       console.log("DEBUG: Remove setTimeout once you figure out how to wait for layers to exist...");
  //       setTimeout(() => {

  //         // Restore map filters on page
  //         handleAllocationDateChange(allocationDates);
  //         handleOwnerClassificationChange(ownerClassifications);

  //         setHasAppliedFilters(true);
  //       }, 1000)
  //     })
  //   }
  // }, [allocationDates, ownerClassifications])

  const clearMapFilters = () => {
    setFilters({});
  }

  return (
    <>
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
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <label>Change Map Legend</label>
        <select className="form-select" onChange={(event) => console.log(event.target.value)}>
          <option>Beneficial Use</option>
          <option>Customer Type</option>
          <option>Site Type</option>
          <option>Water Source Type</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Search Allocation Owner</label>
        <input type="text" className="form-control" />
      </div>

      <div className="mb-3">
        <label>Owner Classification</label>
        <DropdownMultiselect
          className="form-control"
          options={ownerClassificationsList}
          selected={filters.ownerClassifications ?? []}
          handleOnChange={handleOwnerClassificationChange}
          name="ownerClassification"
        />
      </div>

      <div className="mb-3">
        <label>Beneficial Use</label>
        <BeneficialUseSelect selectedOptions={convertLayersToBeneficialUseOptions(filters.beneficialUses ?? [])} options={availableOptions} onChange={handleBeneficialUseChange} />
      </div>

      <div className="mb-3">
        <label>Water Source Type</label>
        <select className="form-select">
        </select>
      </div>

      <div className="mb-3 form-check form-switch">
        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
        <label className="form-check-label">Include Empty Amount and Priority Date Value</label>
      </div>

      <div className="mb-3">
        <label>Flow Range</label>
        <span>- CFS to - CFS</span>
        <FlowRangeSlider handleChange={(values) => console.log(values)} />
      </div>

      <div className="mb-3">
        <label>Volume Range</label>
        <span>- AF to - AF</span>
        <VolumeRangeSlider handleChange={(values) => console.log(values)} />
      </div>

      {/* <div className="mb-3">
        <label>Allocation Priority Date</label>
        <span>{allocationDates[0]} to {allocationDates[1]}</span>
        <AllocationDateSlider handleChange={handleAllocationDateChange} dates={allocationDates} />
      </div> */}

      <div className="mb-3">
        <label>MAP THEME</label>
        <MapThemeSelector />
      </div>

      <div className="mt-4">
        <Button className="w-100" onClick={clearMapFilters}>
          Reset All Filters
        </Button>
      </div>
    </>
  );
}

export default WaterRightsTab;