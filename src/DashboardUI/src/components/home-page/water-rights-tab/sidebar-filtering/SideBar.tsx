import React, { useCallback, useMemo, useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';

import { useWaterRightsContext } from './WaterRightsProvider';
import { useNldiFilter } from './nldi/hooks/useNldiFilter';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';
import { useTimeSeriesFilter } from './time-series/hooks/useTimeSeriesFilter';

import { MapTheme } from '../map-options/components/MapTheme';
import { PointSize } from '../map-options/components/PointSize';
import { MapGrouping } from '../map-options/components/MapGrouping';
import { PodPou } from '../map-options/components/PodPou';

import OverlaysFilter from './overlays/components/OverlaysFilter';
import WaterRights from './water-rights/components/WaterRights';
import TimeSeriesFilter from './time-series/components/TimeSeriesFilter';
import { NldiFilters } from './nldi/components/NldiFilters';

function SideBar() {
  const { filters, setFilters, resetWaterRightsOptions } = useWaterRightsContext();
  const { isWaterRightsFilterActive } = filters;
  const toggleWaterRightFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      isWaterRightsFilterActive: !prev.isWaterRightsFilterActive,
    }));
  }, [setFilters]);

  const { isOverlayFilterActive, setOverlayFilterActive, resetOverlaysOptions } = useOverlaysFilter();
  const toggleOverlayFilter = useCallback(() => {
    setOverlayFilterActive(!isOverlayFilterActive);
  }, [isOverlayFilterActive, setOverlayFilterActive]);

  const { isNldiFilterActive, setNldiMapActiveStatus } = useNldiFilter();
  const toggleNldiFilterStatus = useCallback(() => {
    setNldiMapActiveStatus(!isNldiFilterActive);
  }, [isNldiFilterActive, setNldiMapActiveStatus]);

  const { isTimeSeriesFilterActive, setTimeSeriesFilterActive, resetTimeSeriesOptions } = useTimeSeriesFilter();
  const toggleTimeSeriesFilter = useCallback(() => {
    setTimeSeriesFilterActive(!isTimeSeriesFilterActive);
  }, [isTimeSeriesFilterActive, setTimeSeriesFilterActive]);

  const [activeKeys, setActiveKeys] = useState<string[]>(
    isNldiFilterActive ? ['nldi'] : ['colorSizeTools', 'siteSelectionFilters'],
  );

  const handleResetAllFilters = useCallback(() => {
    resetWaterRightsOptions();
    resetOverlaysOptions();
    resetTimeSeriesOptions();
  }, [resetWaterRightsOptions, resetOverlaysOptions, resetTimeSeriesOptions]);

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
  }, [activeKeys, isTimeSeriesFilterActive, isNldiFilterActive, isWaterRightsFilterActive, isOverlayFilterActive]);

  return (
    <>
      <div className="m-3">
        <Button variant="outline-danger" className="w-100" onClick={handleResetAllFilters}>
          Reset All Filters
        </Button>
      </div>

      <div className="position-relative flex-grow-1 panel-content">
        <Accordion flush alwaysOpen activeKey={openAccordionKeys} onSelect={setOpenAccordionKeys}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOverlayFilter();
                }}
              />
              <label className="fw-bold ms-2">OVERLAY FILTER</label>
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWaterRightFilters();
                }}
              />
              <label className="fw-bold ms-2">WATER RIGHT SELECTION</label>
            </Accordion.Header>
            <Accordion.Body>
              <WaterRights />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="timeSeriesFilters">
            <Accordion.Header onClick={toggleTimeSeriesFilter}>
              <Form.Check
                type="switch"
                id="timeSeriesToggle"
                label=""
                checked={isTimeSeriesFilterActive}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTimeSeriesFilter();
                }}
              />
              <label className="fw-bold ms-2">TIME SERIES FILTER</label>
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNldiFilterStatus();
                }}
              />
              <label className="fw-bold ms-2">NLDI FILTER</label>
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
