import React, { useCallback, useMemo, useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { useWaterRightsContext } from './WaterRightsProvider';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { useNldiFilter } from './nldi/hooks/useNldiFilter';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';
import { MapTheme } from '../map-options/components/MapTheme';
import { PointSize } from '../map-options/components/PointSize';
import { MapGrouping } from '../map-options/components/MapGrouping';
import { PodPou } from '../map-options/components/PodPou';
import OverlaysFilter from './overlays/components/OverlaysFilter';
import WaterRights from './water-rights/components/WaterRights';
import { NldiFilters } from './nldi/components/NldiFilters';
import { useTimeSeriesFilter } from './time-series/hooks/useTimeSeriesFilter';
import TimeSeriesFilter from './time-series/components/TimeSeriesFilter';

function SideBar() {
  const { resetUserOptions } = useWaterRightsContext();
  const { isNldiFilterActive, setNldiMapActiveStatus } = useNldiFilter();
  const [isWaterRightsFilterActive, setWaterRightsFilterActive] = useState(false);
  const { isOverlayFilterActive, setOverlayFilterActive } = useOverlaysFilter();
  const { isTimeSeriesFilterActive, setTimeSeriesFilterActive } = useTimeSeriesFilter();

  const [activeKeys, setActiveKeys] = useState(
    isNldiFilterActive ? ['nldi'] : ['colorSizeTools', 'siteSelectionFilters'],
  );

  const toggleWaterRightFilters = useCallback(() => {
    setWaterRightsFilterActive(!isWaterRightsFilterActive);
  }, [isWaterRightsFilterActive, setWaterRightsFilterActive]);

  const toggleNldiFilterStatus = useCallback(() => {
    setNldiMapActiveStatus(!isNldiFilterActive);
  }, [isNldiFilterActive, setNldiMapActiveStatus]);

  const toggleOverlayFilter = useCallback(() => {
    setOverlayFilterActive(!isOverlayFilterActive);
  }, [isOverlayFilterActive, setOverlayFilterActive]);

  const setOpenAccordionKeys = useCallback(
    (keys: AccordionEventKey) => {
      if (keys === null || keys === undefined) {
        setActiveKeys([]);
      } else if (Array.isArray(keys)) {
        setActiveKeys(keys);
      } else {
        setActiveKeys([keys]);
      }
    },
    [setActiveKeys],
  );

  const openAccordionKeys = useMemo(() => {
    const keys = [...activeKeys].filter(
      (key) =>
        key !== 'nldi' && key !== 'siteSelectionFilters' && key !== 'overlayFilters' && key !== 'timeSeriesFilters',
    );

    if (isTimeSeriesFilterActive) {
      keys.push('timeSeriesFilters');
    }
    if (isNldiFilterActive) {
      keys.push('nldi');
    }
    if (isWaterRightsFilterActive) {
      keys.push('siteSelectionFilters');
    }
    if (isOverlayFilterActive) {
      keys.push('overlayFilters');
    }

    return keys;
  }, [activeKeys, isNldiFilterActive, isWaterRightsFilterActive, isOverlayFilterActive, isTimeSeriesFilterActive]);

  return (
    <>
      <div className="m-3">
        <Button variant="outline-danger" className="w-100" onClick={resetUserOptions}>
          Reset All Filters
        </Button>
      </div>
      <div className="position-relative flex-grow-1 panel-content">
        <Accordion flush activeKey={openAccordionKeys} alwaysOpen onSelect={setOpenAccordionKeys}>
          <Accordion.Item eventKey="colorSizeTools">
            <Accordion.Header>COLOR AND SIZE TOOLS</Accordion.Header>
            <Accordion.Body>
              <MapGrouping />
              <PointSize />
              <PodPou />
              <MapTheme />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="overlayFilters">
            <Accordion.Header onClick={toggleOverlayFilter}>
              <Form.Check
                type="switch"
                id="overlayFilters"
                label=""
                checked={isOverlayFilterActive}
                onChange={toggleOverlayFilter}
              />
              <label className="fw-bold">OVERLAY FILTER {isOverlayFilterActive}</label>
            </Accordion.Header>
            <Accordion.Body>
              <OverlaysFilter />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="siteSelectionFilters">
            <Accordion.Header onClick={toggleWaterRightFilters}>
              <Form.Check
                type="switch"
                id="waterRightSelection"
                label=""
                checked={isWaterRightsFilterActive}
                onChange={toggleWaterRightFilters}
              />
              <label className="fw-bold">WATER RIGHT SELECTION {isWaterRightsFilterActive}</label>
            </Accordion.Header>
            <Accordion.Body>
              <WaterRights />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="timeSeriesFilters">
            <Accordion.Header>
              <Form.Check
                type="switch"
                id="timeSeriesToggle"
                label=""
                checked={isTimeSeriesFilterActive}
                onChange={() => setTimeSeriesFilterActive(!isTimeSeriesFilterActive)}
              />
              <label className="fw-bold">TIME SERIES FILTER</label>
            </Accordion.Header>
            <Accordion.Body>
              <TimeSeriesFilter />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="nldi">
            <Accordion.Header onClick={toggleNldiFilterStatus}>
              <Form.Check
                type="switch"
                id="nldi"
                label=""
                checked={isNldiFilterActive}
                onChange={toggleNldiFilterStatus}
              />
              <label className="fw-bold">NLDI FILTER {isNldiFilterActive}</label>
            </Accordion.Header>
            <div className="px-4" style={{ background: 'ghostwhite' }}>
              <a
                className="h6"
                target="_blank"
                rel="noreferrer"
                href="https://westernstateswater.org/wade/westdaat-nldi-geoconnex-documentation/"
              >
                Learn About NLDI-Geoconnex filter here
              </a>
              <label className="h6">
                <i>
                  Search along the stream network using the Hydro Network-Linked Data Index (NLDI) and Geoconnex
                  Frameworks
                </i>
              </label>
            </div>
            <Accordion.Body>
              <NldiFilters />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default SideBar;
