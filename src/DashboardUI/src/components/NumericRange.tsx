import { ChangeEvent, useEffect, useState } from "react";

export interface NumericRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  units: string,
  placeholderText: string,
  onChange: (min: number | undefined, max: number | undefined) => void;
}
function NumericRange(props: NumericRangeProps) {
  const [minValue, setMinValue] = useState(props.initialMin);
  const [maxValue, setMaxValue] = useState(props.initialMax);

  const parseValue = (val: string): number | undefined =>{
    let value: number | undefined = parseInt(val);
    if(isNaN(value) || value < 0) value = undefined;
    return value;
  }
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinValue(parseValue(e.target.value));
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxValue(parseValue(e.target.value));
  };

  useEffect(() => {
    props.onChange(minValue, maxValue);

  }, [minValue, maxValue]);

  return (
    <div className="input-group mb-3">
      <input min={-1} type="number" className="form-control" value={minValue ?? ""} placeholder={`Minimum ${props.placeholderText}`} aria-label="Username" onChange={handleMinChange} />
      {props.units && <span className="input-group-text">{props.units}</span>}
      <span className="input-group-text px-2">to</span>
      <input min={-1} type="number" className="form-control" value={maxValue ?? ""} placeholder={`Maximum ${props.placeholderText}`} aria-label="Server" onChange={handleMaxChange} />
      {props.units && <span className="input-group-text">{props.units}</span>}
    </div>
  );
}

export default NumericRange;
