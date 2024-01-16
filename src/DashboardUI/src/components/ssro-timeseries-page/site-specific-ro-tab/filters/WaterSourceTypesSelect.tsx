import { useCallback, useMemo } from "react";
import { MultiValue } from "react-select";
import Select from "react-select";
import { useWaterSourceTypesFilter } from "../hooks/filters/useWaterSourceTypesFilter";
import { useSiteSpecificContext } from "../Provider";

export function WaterSourceTypesSelect() {
  const {waterSourceTypes, setWaterSourceTypes} = useWaterSourceTypesFilter();

  const {
    hostData:{
      waterSourcesQuery: {data: allWaterSourceTypes}
    }
  } = useSiteSpecificContext();

  const handleWaterSourceTypeChange = useCallback((values: MultiValue<{ value: string; }>) => {
    const result = values.map(option => option.value);
    setWaterSourceTypes(result.length > 0 ? result : undefined);
  }, [setWaterSourceTypes]);

  const options = useMemo(() => {
    return allWaterSourceTypes?.map(type => ({ value: type }));
  }, [allWaterSourceTypes]);

  const selectedValues = useMemo(() => {
    return waterSourceTypes?.map(type => ({ value: type })) ?? [];
  }, [waterSourceTypes]);

  return <div className="mb-3">
           <label htmlFor="wr-water-source-types-filter">Water Source Type</label>
           <Select
             id="wr-water-source-types-filter"
             isMulti
             options={options}
             onChange={handleWaterSourceTypeChange}
             closeMenuOnSelect={false}
             placeholder="Select Water Source Type(s)"
             name="waterSourceTypes"
             getOptionLabel={(option) => option.value}
             value={selectedValues} />
         </div>
}
