import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import moment from "moment";

export interface PriorityDateRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export function PriorityDateRange(props: PriorityDateRangeProps) {
  const [minValueString, setMinValueString] = useState(props.initialMin ? moment.unix(props.initialMin).format("YYYY-MM-DD") : "");
  const [maxValueString, setMaxValueString] = useState(props.initialMax ? moment.unix(props.initialMax).format("YYYY-MM-DD") : "");

  const { onChange } = props;

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
    setMinValueString(props.initialMin ? moment.unix(props.initialMin).format("YYYY-MM-DD") : "");
  }, [props.initialMin, setMinValueString]);

  useEffect(() => {
    setMaxValueString(props.initialMax ? moment.unix(props.initialMax).format("YYYY-MM-DD") : "");
  }, [props.initialMax, setMaxValueString]);

  useEffect(() => {
    if (isValid) {
      onChange(minMoment.isValid() ? minMoment.unix() : undefined, maxMoment.isValid() ? maxMoment.unix() : undefined);
    }
  }, [minMoment, maxMoment, isValid, onChange]);

  return (
    <InputGroup className="mb-3">
      <Form.Control type="date" value={minValueString} max={moment().format("YYYY-MM-DD")} placeholder="Min Priority Date" aria-label="Minimum Priority Date" onChange={handleMinChange} />
      <InputGroup.Text className="px-2">to</InputGroup.Text>
      <Form.Control type="date" value={maxValueString} max={moment().format("YYYY-MM-DD")} placeholder="Max Priority Date" aria-label="Maximum Priority Date" onChange={handleMaxChange} />
    </InputGroup>
  );
}
