import Select from "react-select";
import { useOwnerClassificationsFilter } from "../hooks/filters/useOwnerClassificationsFilter";
import { useCallback, useContext } from "react";
import { WaterRightsContext } from "../Provider";

export function OwnerClassificationType() {
  const {ownerClassifications, setOwnerClassifications} = useOwnerClassificationsFilter();

  const {
    hostData:{
      ownerClassificationsQuery: { data: allOwnerClassifications}
    }
  } = useContext(WaterRightsContext);

  const handleOwnerClassificationChange = useCallback((selectedOptions: string[]) => {
    setOwnerClassifications(selectedOptions.length > 0 ? selectedOptions : undefined)
  }, [setOwnerClassifications]);

  return <div className="mb-3">
           <label htmlFor="wr-owner-classification-type-filter">Owner Classification Type</label>
           <Select
             id="wr-owner-classification-type-filter"
             isMulti
             options={allOwnerClassifications?.map(ownerClassification => ({ value: ownerClassification }))}
             onChange={a => handleOwnerClassificationChange(a.map(option => option.value))}
             closeMenuOnSelect={false}
             placeholder="Select Owner Classification(s)"
             name="ownerClassification"
             getOptionLabel={(option) => option.value}
             value={ownerClassifications?.map(ownerClassification => ({ value: ownerClassification }))} />
         </div>
}