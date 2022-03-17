import NumericRange from "./NumericRange";

export interface VolumeRangeProps {
  initialMin: number | undefined,
  initialMax: number | undefined,
  onChange: (min: number | undefined, max: number | undefined) => void;
}

function VolumeRange(props: VolumeRangeProps) {
  return (
    <NumericRange {...props} placeholderText="Volume" units="AF" />
  );
}

export default VolumeRange;