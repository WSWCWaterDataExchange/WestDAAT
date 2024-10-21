import React from 'react';
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Form, FormControlProps, InputGroup } from "react-bootstrap";

type ControlProps = Omit<FormControlProps, 'onChange' | 'type' | 'value' | 'max' | 'step'>
export interface NumericRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  units: string,
  precision: number,
  onChange: (min: number | undefined, max: number | undefined) => void;
  minControlProps?: ControlProps
  maxControlProps?: ControlProps
}
function NumericRange(props: NumericRangeProps) {
  const { initialMin, initialMax, units, precision, onChange, minControlProps, maxControlProps } = props;

  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const parseValue = (val: string): number | undefined => {
    let value: number | undefined = parseFloat(val);
    if (isNaN(value) || value < 0) value = undefined;
    return value;
  }
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinValue(parseValue(e.target.value));
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxValue(parseValue(e.target.value));
  };

  useEffect(() => {
    onChange(minValue, maxValue);
  }, [minValue, maxValue, onChange]);

  useEffect(() => {
    setMinValue(initialMin);
  }, [initialMin, setMinValue]);

  useEffect(() => {
    setMaxValue(initialMax);
  }, [initialMax, setMaxValue]);

  const step = useMemo(() => 1 / (10 ** precision), [precision]);

  return (
    <InputGroup className="mb-3">
      <Form.Control {...minControlProps} min={0 - step} type="number" value={minValue ?? ""} step={step} onChange={handleMinChange} />
      {units && <InputGroup.Text>{units}</InputGroup.Text>}
      <InputGroup.Text className="px-2">to</InputGroup.Text>
      <Form.Control {...maxControlProps} min={0 - step} type="number" value={maxValue ?? ""} step={step} onChange={handleMaxChange} />
      {units && <InputGroup.Text>{units}</InputGroup.Text>}
    </InputGroup>
  );
}

export default NumericRange;
