import React from "react";
import {useLegalStatusesFilter} from "../hooks/filters/useLegalStatusesFilter";
import {useWaterRightsContext} from "../Provider";
import {useCallback, useMemo} from "react";
import Select, {MultiValue} from "react-select";

export function LegalStatusSelect() {
    const {legalStatuses, setLegalStatuses} = useLegalStatusesFilter();

    const {
        hostData: {
            legalStatusesQuery: {data: allLegalStatuses}
        }
    } = useWaterRightsContext();

    const handleLegalStatusChange = useCallback((values: MultiValue<{ value: string }>) => {
        const result = values.map(option => option.value);
        setLegalStatuses(result.length > 0 ? result : undefined);
    }, [setLegalStatuses]);

    const options = useMemo(() => {
        return allLegalStatuses?.map(type => ({value: type}));
    }, [allLegalStatuses]);

    const selectedValues = useMemo(() => {
        return legalStatuses?.map(type => ({value: type})) ?? [];
    }, [legalStatuses]);

    return <div className="mb-3">
        <label htmlFor="wr-legal-statuses-filter">Legal Status</label>
        <Select
            id="wr-legal-statuses-filter"
            isMulti
            options={options}
            onChange={handleLegalStatusChange}
            closeMenuOnSelect={false}
            placeholder="Select Legal Status(s)"
            name="legalStatuses"
            getOptionLabel={(option) => option.value}
            value={selectedValues}/>
    </div>
}