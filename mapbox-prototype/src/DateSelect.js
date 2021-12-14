import React, { useEffect } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { scaleTime } from "d3-scale";
import moment from 'moment';

// Helpful tutorials:
// https://www.npmjs.com/package/react-compound-slider
// https://sghall.github.io/react-compound-slider/#/getting-started/tutorial
// https://sghall.github.io/react-compound-slider/#/slider-demos/horizontal
// https://sghall.github.io/react-compound-slider/#/component-api/slider
// https://codesandbox.io/s/react-compound-slider-date-time-slider-forked-zgulo?file=/index.js:1871-1945

const sliderStyle = {
    position: 'relative',
    width: '100%',
    height: 90,
}

const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 5,
    backgroundColor: '#fff',
}

const DateSelect = (props) => {
    const domainMin = 1985;
    const domainMax = moment().year().valueOf();

    const [selected, setSelected] = React.useState([domainMax]);
    const [min] = React.useState(domainMin);
    const [max] = React.useState(domainMax);

    const dateTicks = scaleTime()
        .domain([min, max])
        .ticks((max - min) / 5)
        .map((d) => +d);

    function Track({ source, target, getTrackProps }) {
        return (
            <div
                style={{
                    position: 'absolute',
                    height: 10,
                    zIndex: 1,
                    marginTop: 35,
                    backgroundColor: '#546C91',
                    borderRadius: 5,
                    cursor: 'pointer',
                    left: `${source.percent}%`,
                    width: `${target.percent - source.percent}%`,
                }}
                {...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */}
            />
        )
    }

    function Handle({
        handle: { id, value, percent },
        getHandleProps
    }) {
        return (
            <div
                style={{
                    left: `${percent}%`,
                    position: 'absolute',
                    marginLeft: -15,
                    marginTop: 25,
                    zIndex: 2,
                    width: 30,
                    height: 30,
                    border: 0,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    backgroundColor: '#2C4870',
                    color: '#333',
                }}
                {...getHandleProps(id)}
            >
                <div style={{ fontFamily: 'Arial, san-serif', fontSize: 11, marginTop: -25, marginLeft: 0, color: '#fff' }}>
                    {value}
                </div>
            </div>
        )
    }

    function Tick({ tick, count, format }) {
        return (
            <div>
                <div
                    style={{
                        position: "absolute",
                        marginTop: 50,
                        width: 1,
                        height: 5,
                        backgroundColor: "rgb(200,200,200)",
                        left: `${tick.percent}%`
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        marginTop: 55,
                        fontSize: 10,
                        textAlign: "center",
                        fontFamily: "Arial, san-serif",
                        marginLeft: `${-(100 / count) / 2}%`,
                        width: `${100 / count}%`,
                        left: `${tick.percent}%`
                    }}
                >
                    {format(tick.value)}
                </div>
            </div>
        );
    }

    function formatTickTime(ms) {
        return ms;
    }

    function onChange(values) {
        setSelected(values);
    }

    useEffect(() => {
        props.filterDateRange(selected);
    }, [selected]);

    return (
        <>
            <Slider
                rootStyle={sliderStyle}
                domain={[+min, +max]}
                values={[+max]} // Set handles number & initial position
                step={1}
                mode={3}
                onChange={onChange}
            >
                <Rail>
                    {({ getRailProps }) => (
                        <div style={railStyle} {...getRailProps()} />
                    )}
                </Rail>
                <Handles>
                    {({ handles, getHandleProps }) => (
                        <div className="slider-handles">
                            {handles.map(handle => (
                                <Handle
                                    key={handle.id}
                                    handle={handle}
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
                <Ticks values={dateTicks}>
                    {({ ticks }) => (
                        <div className="slider-ticks">
                            {ticks.map((tick) => (
                                <Tick
                                    key={tick.id}
                                    tick={tick}
                                    count={ticks.length}
                                    format={formatTickTime}
                                />
                            ))}
                        </div>
                    )}
                </Ticks>
            </Slider>
        </>
    );
};

export default DateSelect;
