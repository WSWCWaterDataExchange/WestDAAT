import { InputLabelProps, TextField, TextFieldProps } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid/components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterOperator } from '@mui/x-data-grid/models/gridFilterOperator';
import { useEffect, useState } from 'react';

export const dateRangeFilter: GridFilterOperator<any, string> = {
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    const startDateExists = filterItem.value && filterItem.value[0] !== null && filterItem.value[0].trim().length > 0;
    const endDateExists = filterItem.value && filterItem.value[1] !== null && filterItem.value[1].trim().length > 0;

    if (!startDateExists || !endDateExists) {
      return null;
    }

    const filterFn = (value: string) => {
      return (
        value !== null &&
        startDateExists &&
        endDateExists &&
        new Date(filterItem.value[0]) <= new Date(value) &&
        new Date(value) <= new Date(filterItem.value[1])
      );
    };

    return filterFn;
  },

  InputComponent: DateRangeFilter,
};

export function DateRangeFilter(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef = null } = props;
  const [filterValueState, setFilterValueState] = useState<[string, string]>(['', '']);

  useEffect(() => {
    const itemValue = item.value ?? ['', ''];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (startDate: string, endDate: string) => {
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

  const inputProps: InputLabelProps = {
    shrink: true,
  };

  return (
    <div className="d-inline-flex">
      <TextField
        className="w-100"
        name="lower-bound-input"
        label="From"
        type="date"
        placeholder="date"
        variant="standard"
        onChange={handleStartDateFilter}
        value={filterValueState[0]}
        inputRef={focusElementRef}
        slotProps={{ inputLabel: inputProps }}
      />
      <TextField
        className="w-100"
        name="upper-bound-input"
        label="To"
        type="date"
        placeholder="date"
        variant="standard"
        onChange={handleEndDateFilter}
        value={filterValueState[1]}
        slotProps={{ inputLabel: inputProps }}
      />
    </div>
  );
}
