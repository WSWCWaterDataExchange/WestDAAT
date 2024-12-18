import React, { JSX, useMemo } from 'react';
import PieCharts from './PieCharts';
import Tab from 'react-bootstrap/esm/Tab';
import { useGetAnalyticsSummaryInfo } from '../../../hooks/queries';
import { useWaterRightsSearchCriteria } from './hooks/useWaterRightsSearchCriteria';
import Select from 'react-select';

interface DropdownOption {
  value: string;
  label: string;
}

interface ChartTabPanesControllerProps {
  activeTab: string;
  show: boolean;
}

function ChartTabPanesController(props: ChartTabPanesControllerProps) {
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const { data: pieChartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(searchCriteria);

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

  const selectElement: JSX.Element = useMemo(
    () => (
      <>
        {!isFetching && (
          // `Select` must only be rendered when data is available, otherwise the `defaultValue` will not be set properly
          <div className="mb-3 col-4">
            <label htmlFor="grouping-dropdown">Select Grouping</label>
            <Select<DropdownOption>
              id="grouping-dropdown"
              placeholder="Select Grouping"
              isLoading={isFetching}
              options={dropdownOptions}
              defaultValue={dropdownDefaultValue}
            />
          </div>
        )}
      </>
    ),
    [isFetching, dropdownOptions, dropdownDefaultValue],
  );

  return (
    <Tab.Pane eventKey="pieChart">
      {props.activeTab === 'pieChart' && props.show && (
        <PieCharts
          pieChartSearchResults={pieChartSearchResults}
          isFetching={isFetching}
          dropdownElement={selectElement}
        />
      )}
    </Tab.Pane>
  );
}

export default ChartTabPanesController;
