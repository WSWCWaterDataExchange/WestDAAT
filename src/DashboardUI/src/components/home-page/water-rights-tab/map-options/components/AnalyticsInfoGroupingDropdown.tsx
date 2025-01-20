import React, { useMemo } from 'react';
import { DropdownOption } from '../../../../../data-contracts/DropdownOption';
import Select, { SingleValue } from 'react-select';
import { AnalyticsSummaryInformationResponse } from '../../../../../data-contracts/AnalyticsSummaryInformationResponse';

interface AnalyticsInfoGroupingDropdownProps {
  isFetching: boolean;
  analyticsSummaryInformationResponse: AnalyticsSummaryInformationResponse | undefined;
  selectedDropdownOption: DropdownOption | null;
  setSelectedDropdownOption: (option: DropdownOption) => void;
}

function AnalyticsInfoGroupingDropdown(props: AnalyticsInfoGroupingDropdownProps) {
  const response = props.analyticsSummaryInformationResponse;

  const dropdownOptions: DropdownOption[] = useMemo(() => {
    if (!response || !response.groupItems) {
      return [];
    }
    return response.groupItems.map((option) => ({
      value: option.value.toString(),
      label: option.label,
    }));
  }, [response]);

  const dropdownDefaultValue: DropdownOption | null = useMemo(() => {
    if (!response || !response.groupItems) {
      return null;
    }
    return dropdownOptions.find((option) => option.value === response.groupValue.toString()) ?? null;
  }, [response]);

  return (
    <div className="mb-3 col-4">
      <label htmlFor="grouping-dropdown">Select Grouping</label>
      <Select<DropdownOption>
        id="grouping-dropdown"
        placeholder="Select Grouping"
        isLoading={props.isFetching}
        options={dropdownOptions}
        onChange={(newValue: SingleValue<DropdownOption>) =>
          props.setSelectedDropdownOption(newValue as DropdownOption)
        }
        value={props.selectedDropdownOption ?? dropdownDefaultValue}
      />
    </div>
  );
}

export default AnalyticsInfoGroupingDropdown;
