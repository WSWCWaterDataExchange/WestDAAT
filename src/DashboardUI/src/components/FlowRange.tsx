import NumericRange from "./NumericRange";

export interface FlowRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export function FlowRange(props: FlowRangeProps) {
  return (
    <NumericRange {...props} placeholderText="Flow" units="" />
  );
}

export default FlowRange;