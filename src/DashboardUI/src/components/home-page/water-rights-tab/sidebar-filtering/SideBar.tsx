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

  const { isOverlayFilterActive, setOverlayFilterActive, resetOverlaysOptions } = useOverlaysFilter();

  const { isNldiFilterActive, setNldiMapActiveStatus } = useNldiFilter();

  const { isTimeSeriesFilterActive, setTimeSeriesFilterActive, resetTimeSeriesOptions } = useTimeSeriesFilter();

  const [activeKeys, setActiveKeys] = useState<string[]>(() => {
    const keys = ['colorSizeTools'];
    if (isWaterRightsFilterActive) keys.push('siteSelectionFilters');
    if (isOverlayFilterActive) keys.push('overlayFilters');
    if (isTimeSeriesFilterActive) keys.push('timeSeriesFilters');
    if (isNldiFilterActive) keys.push('nldi');
    return keys;
  });

  const handleWaterRightsSwitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setFilters((prev) => ({ ...prev, isWaterRightsFilterActive: newValue }));
      setActiveKeys((prevKeys) => {
        if (newValue) {
          return [...new Set([...prevKeys, 'siteSelectionFilters'])];
        } else {
          return prevKeys.filter((key) => key !== 'siteSelectionFilters');
        }
      });
    },
    [setFilters],
  );

  const handleOverlaySwitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setOverlayFilterActive(newValue);
      setActiveKeys((prevKeys) => {
        if (newValue) {
          return [...new Set([...prevKeys, 'overlayFilters'])];
        } else {
          return prevKeys.filter((key) => key !== 'overlayFilters');
        }
      });
    },
    [setOverlayFilterActive],
  );

  const handleTimeSeriesSwitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setTimeSeriesFilterActive(newValue);
      setActiveKeys((prevKeys) => {
        if (newValue) {
          return [...new Set([...prevKeys, 'timeSeriesFilters'])];
        } else {
          return prevKeys.filter((key) => key !== 'timeSeriesFilters');
        }
      });
    },
    [setTimeSeriesFilterActive],
  );

  const handleNldiSwitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setNldiMapActiveStatus(newValue);
      setActiveKeys((prevKeys) => {
        if (newValue) {
          return [...new Set([...prevKeys, 'nldi'])];
        } else {
          return prevKeys.filter((key) => key !== 'nldi');
        }
      });
    },
    [setNldiMapActiveStatus],
  );

  const setOpenAccordionKeys = useCallback(
    (keys: AccordionEventKey) => {
      let newKeys: string[];
      if (keys === null || keys === undefined) {
        newKeys = [];
      } else if (Array.isArray(keys)) {
        newKeys = keys;
      } else {
        newKeys = [keys];
      }
      setActiveKeys(newKeys);

      if (newKeys.includes('overlayFilters') && !isOverlayFilterActive) {
        setOverlayFilterActive(true);
      }
      if (newKeys.includes('siteSelectionFilters') && !isWaterRightsFilterActive) {
        setFilters((prev) => ({ ...prev, isWaterRightsFilterActive: true }));
      }
      if (newKeys.includes('timeSeriesFilters') && !isTimeSeriesFilterActive) {
        setTimeSeriesFilterActive(true);
      }
      if (newKeys.includes('nldi') && !isNldiFilterActive) {
        setNldiMapActiveStatus(true);
      }
    },
    [
      setActiveKeys,
      isOverlayFilterActive,
      setOverlayFilterActive,
      isWaterRightsFilterActive,
      setFilters,
      isTimeSeriesFilterActive,
      setTimeSeriesFilterActive,
      isNldiFilterActive,
      setNldiMapActiveStatus,
    ],
  );

  const handleResetAllFilters = useCallback(() => {
    resetWaterRightsOptions();
    resetOverlaysOptions();
    resetTimeSeriesOptions();
  }, [resetWaterRightsOptions, resetOverlaysOptions, resetTimeSeriesOptions]);

  const openAccordionKeys = useMemo(() => activeKeys, [activeKeys]);

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
              <MapTheme />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="overlayFilters">
            <Accordion.Header>
              <Form.Check
                type="switch"
                id="overlayFilters"
                label=""
                checked={isOverlayFilterActive}
                onChange={handleOverlaySwitchChange}
              />
              <label className="fw-bold ms-2">OVERLAY FILTER</label>
            </Accordion.Header>
            <Accordion.Body>
              <OverlaysFilter />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="siteSelectionFilters">
            <Accordion.Header>
              <Form.Check
                type="switch"
                id="waterRightSelection"
                label=""
                checked={isWaterRightsFilterActive}
                onChange={handleWaterRightsSwitchChange}
              />
              <label className="fw-bold ms-2">WATER RIGHT SELECTION</label>
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
                onChange={handleTimeSeriesSwitchChange}
              />
              <label className="fw-bold ms-2">TIME SERIES FILTER</label>
            </Accordion.Header>
            <Accordion.Body>
              <TimeSeriesFilter />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="nldi">
            <Accordion.Header>
              <Form.Check
                type="switch"
                id="nldi"
                label=""
                checked={isNldiFilterActive}
                onChange={handleNldiSwitchChange}
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
