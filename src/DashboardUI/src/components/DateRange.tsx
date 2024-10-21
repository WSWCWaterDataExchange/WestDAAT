import React from 'react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Form, FormControlProps, InputGroup } from 'react-bootstrap';
import moment from 'moment';

type ControlProps = Omit<
  FormControlProps,
  'onChange' | 'type' | 'value' | 'max'
>;
export interface DateRangeProps {
  initialMin: number | undefined;
  initialMax: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
  minControlProps?: ControlProps;
  maxControlProps?: ControlProps;
}

export function DateRange(props: DateRangeProps) {
  const { initialMin, initialMax, onChange, minControlProps, maxControlProps } =
    props;

  const [minValueString, setMinValueString] = useState(
    initialMin ? moment.unix(initialMin).format('YYYY-MM-DD') : '',
  );
  const [maxValueString, setMaxValueString] = useState(
    initialMax ? moment.unix(initialMax).format('YYYY-MM-DD') : '',
  );

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinValueString(e.target.value);
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxValueString(e.target.value);
  };

  const minMoment = useMemo(() => {
    return moment(minValueString);
  }, [minValueString]);

  const maxMoment = useMemo(() => {
    return moment(maxValueString);
  }, [maxValueString]);

  const isValid = useMemo(() => {
    const isMinValueValid = minValueString.length === 0 || minMoment.isValid;
    const isMaxValueValid = maxValueString.length === 0 || maxMoment.isValid;
    return isMinValueValid && isMaxValueValid;
  }, [minValueString, minMoment, maxValueString, maxMoment]);

  useEffect(() => {
    setMinValueString(
      initialMin ? moment.unix(initialMin).format('YYYY-MM-DD') : '',
    );
  }, [initialMin, setMinValueString]);

  useEffect(() => {
    setMaxValueString(
      initialMax ? moment.unix(initialMax).format('YYYY-MM-DD') : '',
    );
  }, [initialMax, setMaxValueString]);

  useEffect(() => {
    if (isValid) {
      onChange(
        minMoment.isValid() ? minMoment.unix() : undefined,
        maxMoment.isValid() ? maxMoment.unix() : undefined,
      );
    }
  }, [minMoment, maxMoment, isValid, onChange]);

  return (
    <InputGroup className="mb-3">
      <Form.Control
        {...minControlProps}
        type="date"
        value={minValueString}
        max={moment().format('YYYY-MM-DD')}
        onChange={handleMinChange}
      />
      <InputGroup.Text className="px-2">to</InputGroup.Text>
      <Form.Control
        {...maxControlProps}
        type="date"
        value={maxValueString}
        max={moment().format('YYYY-MM-DD')}
        onChange={handleMaxChange}
      />
    </InputGroup>
  );
}
