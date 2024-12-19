import React, { useMemo } from 'react';
import { DropdownOption } from '../../../data-contracts/DropdownOption';
import Select from 'react-select';
import { AnalyticsSummaryInformationResponse } from '../../../data-contracts/AnalyticsSummaryInformationResponse';

interface AnalyticsInfoGroupingDropdownProps {
  isFetching: boolean;
  pieChartSearchResults: AnalyticsSummaryInformationResponse | undefined;
}

function AnalyticsInfoGroupingDropdown(props: AnalyticsInfoGroupingDropdownProps) {
  const pieChartSearchResults = props.pieChartSearchResults;

  const dropdownOptions: DropdownOption[] = useMemo(() => {
    if (!pieChartSearchResults || !pieChartSearchResults.dropdownOptions) {
      return [];
    }
    return pieChartSearchResults.dropdownOptions.map((option) => ({
      value: option.value.toString(),
      label: option.label,
    }));
  }, [pieChartSearchResults]);

  const dropdownDefaultValue: DropdownOption | null = useMemo(() => {
    if (!pieChartSearchResults || !pieChartSearchResults.dropdownOptions) {
      return null;
    }
    return dropdownOptions.find((option) => option.value === pieChartSearchResults.selectedValue.toString()) ?? null;
  }, [pieChartSearchResults]);

  return (
    !props.isFetching && (
      // `Select` must only be rendered when data is available, otherwise the `defaultValue` will not be set properly
      <div className="mb-3 col-4">
        <label htmlFor="grouping-dropdown">Select Grouping</label>
        <Select<DropdownOption>
          id="grouping-dropdown"
          placeholder="Select Grouping"
          isLoading={props.isFetching}
          options={dropdownOptions}
          defaultValue={dropdownDefaultValue}
        />
      </div>
    )
  );
}

export default AnalyticsInfoGroupingDropdown;
