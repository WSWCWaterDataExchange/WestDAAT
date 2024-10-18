import React from 'react';
import Select from "react-select";
import { useOwnerClassificationsFilter } from "../hooks/filters/useOwnerClassificationsFilter";
import { useCallback } from "react";
import { useWaterRightsContext } from "../Provider";

export function OwnerClassificationType() {
  const {ownerClassifications, setOwnerClassifications} = useOwnerClassificationsFilter();

  const {
    state:{
      ownerClassificationsQuery: { data: allOwnerClassifications}
    }
  } = useWaterRightsContext();

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