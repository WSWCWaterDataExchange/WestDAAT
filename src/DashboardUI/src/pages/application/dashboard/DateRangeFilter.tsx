import { TextField, TextFieldProps } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid/components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterOperator } from '@mui/x-data-grid/models/gridFilterOperator';
import { useState } from 'react';
import InputGroup from 'react-bootstrap/esm/InputGroup';

export const dateRangeFilter: GridFilterOperator<any, Date> = {
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    console.log(`value = ${JSON.stringify(filterItem)}`);

    if (!filterItem.value || filterItem.value.length !== 2) {
      return null;
    }
    if (filterItem.value[0] === null || filterItem.value[1] === null) {
      return null;
    }

    const filterFn = (value: Date) => {
      console.log(
        `value in filterFn = ${JSON.stringify(value)}, startDate = ${filterItem.value[0]}, endDate = ${filterItem.value[1]}`,
      );
      return value !== null && filterItem.value[0] <= value && value <= filterItem.value[1];
    };

    return filterFn;
  },
  InputComponent: DateRangeFilter,
};

export function DateRangeFilter(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef = null } = props;
  const [filterValueState, setFilterValueState] = useState<[string, string]>(['', '']);
  console.log(`DateRangeFilter - starting values: ${filterValueState[0]} - ${filterValueState[1]}`);

  const updateFilterValue = (startDate: string, endDate: string) => {
    console.log(`updating filter range to: ${startDate} - ${endDate}`);
    applyValue({ ...item, value: [startDate, endDate] });
    setFilterValueState([startDate, endDate]);
  };

  const handleStartDateFilter: TextFieldProps['onChange'] = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    updateFilterValue(newStartDate, filterValueState[1]);
  };

  const handleEndDateFilter: TextFieldProps['onChange'] = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    updateFilterValue(filterValueState[0], newEndDate);
  };

  return (
    <div className="inline-flex">
      <TextField
        name="lower-bound-input"
        placeholder="From"
        type="date"
        onChange={handleStartDateFilter}
        value={filterValueState[0]}
      ></TextField>
      <TextField
        name="upper-bound-input"
        placeholder="To"
        type="date"
        onChange={handleEndDateFilter}
        value={filterValueState[1]}
      ></TextField>
    </div>
  );
}
