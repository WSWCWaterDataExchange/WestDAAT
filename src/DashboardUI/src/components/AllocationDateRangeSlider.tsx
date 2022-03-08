import { useState } from "react";
import { CustomSlider } from "./SliderComponents";

export interface AllocationDateSliderProps {
  handleChange: (values: ReadonlyArray<number>) => void;
}

function AllocationDateSlider(props: AllocationDateSliderProps) {

  const domain = [100, 500];
  const defaultValues = [150, 450];

  const [sliderValues, setSliderValues] = useState(defaultValues);

  const onChange = (values: ReadonlyArray<number>) => {
    setSliderValues(values as any);
    props.handleChange(values);
  };

  return (
    <CustomSlider
      mode={2}
      step={5}
      domain={domain}
      onChange={onChange}
      values={sliderValues}
      className="pt-4 mb-5 position-relative w-100"
     />
  );
}

export default AllocationDateSlider;
