import { CustomSlider } from "./SliderComponents";

export interface AllocationDateSliderProps {
  handleChange: (values: ReadonlyArray<number>) => void;
  dates: number[];
}

function AllocationDateSlider(props: AllocationDateSliderProps) {

  const domain = [1850, new Date().getFullYear()];

  const onChange = (values: ReadonlyArray<number>) => {
    props.handleChange(values);
  };

  return (
    <CustomSlider
      mode={2}
      step={1}
      ticks={8}
      domain={domain}
      onChange={onChange}
      values={props.dates}
      className="pt-4 mb-5 position-relative w-100"
     />
  );
}

export default AllocationDateSlider;
