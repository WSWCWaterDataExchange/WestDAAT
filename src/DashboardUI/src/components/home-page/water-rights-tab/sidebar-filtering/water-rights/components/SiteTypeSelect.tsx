import React from 'react';
import { useSiteTypesFilter } from '../hooks/useSiteTypesFilter';
import { useWaterRightsContext } from '../../WaterRightsProvider';
import { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';

export function SiteTypeSelect() {
  const { siteTypes, setSiteTypes } = useSiteTypesFilter();

  const {
    hostData: {
      siteTypesQuery: { data: allSiteTypes },
    },
  } = useWaterRightsContext();

  const handleSiteTypeChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setSiteTypes(result.length > 0 ? result : undefined);
    },
    [setSiteTypes],
  );

  const options = useMemo(() => {
    return allSiteTypes?.map((type) => ({ value: type }));
  }, [allSiteTypes]);

  const selectedValues = useMemo(() => {
    return siteTypes?.map((type) => ({ value: type })) ?? [];
  }, [siteTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="wr-site-types-filter">Site Type</label>
      <Select
        id="wr-site-types-filter"
        isMulti
        options={options}
        onChange={handleSiteTypeChange}
        closeMenuOnSelect={false}
        placeholder="Select Site Type(s)"
        name="siteTypes"
        getOptionLabel={(option) => option.value}
        value={selectedValues}
      />
    </div>
  );
}
