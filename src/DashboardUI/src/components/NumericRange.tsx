import { ChangeEvent, useEffect, useState } from "react";

export interface NumericRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  units: string,
  placeholderText: string,
  precision: number,
  onChange: (min: number | undefined, max: number | undefined) => void;
}
function NumericRange(props: NumericRangeProps) {
  const [minValue, setMinValue] = useState(props.initialMin);
  const [maxValue, setMaxValue] = useState(props.initialMax);

  const { onChange } = props;

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
    setMinValue(props.initialMin);
  }, [props.initialMin, setMinValue]);

  useEffect(() => {
    setMaxValue(props.initialMax);
  }, [props.initialMax, setMaxValue]);

  const step = 1 / (10 ** props.precision);

  return (
    <div className="input-group mb-3">
      <input min={0 - step} type="number" className="form-control" value={minValue ?? ""} step={step} placeholder={`Min ${props.placeholderText}`} aria-label={`Minimum ${props.placeholderText}`} onChange={handleMinChange} />
      {props.units && <span className="input-group-text">{props.units}</span>}
      <span className="input-group-text px-2">to</span>
      <input min={0 - step} type="number" className="form-control" value={maxValue ?? ""} step={step} placeholder={`Max ${props.placeholderText}`} aria-label={`Maximum ${props.placeholderText}`} onChange={handleMaxChange} />
      {props.units && <span className="input-group-text">{props.units}</span>}
    </div>
  );
}

export default NumericRange;
