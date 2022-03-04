import { useState } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./SliderComponents";

function FlowRangeSlider() {

  const domain = [100, 500];
  const defaultValues = [150, 300, 400, 450];

  const [sliderValues, setSliderValues] = useState(defaultValues);

  const onUpdate = (update: ReadonlyArray<number>) => {
    setSliderValues(update as any);
  };

  return (
    <Slider
      mode={2}
      step={5}
      domain={domain}
      onUpdate={onUpdate}
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
