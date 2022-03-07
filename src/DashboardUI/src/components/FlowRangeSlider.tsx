import { useState } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./SliderComponents";

export interface FlowRangeSliderProps {
  handleChange: (values: ReadonlyArray<number>) => void;
}

function FlowRangeSlider(props: FlowRangeSliderProps) {

  const domain = [100, 500];
  const defaultValues = [150, 450];

  const [sliderValues, setSliderValues] = useState(defaultValues);

  const onChange = (values: ReadonlyArray<number>) => {
    setSliderValues(values as any);
    props.handleChange(values);
  };

  return (
    <Slider
      mode={2}
      step={5}
      domain={domain}
      onChange={onChange}
      values={sliderValues}
      className="pt-4 mb-5 position-relative w-100"
    >
      <Rail>
        {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map(handle => (
              <Handle
                key={handle.id}
                handle={handle}
                domain={domain}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
          </div>
        )}
      </Tracks>
      <Ticks count={5}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map(tick => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>
    </Slider>
  );
}

export default FlowRangeSlider;
