import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Accordion } from 'react-bootstrap';
import BeneficialUseSelect from './filters/BeneficialUseSelect';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { useWaterRightsContext } from './Provider';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import {
  AllocationOwnerSearch,
  StatesSelect,
  WaterSourceTypesSelect,
  OwnerClassificationType,
  RiverBasinSelect,
  SiteContent,
  PriorityDateRange,
  FlowRange,
  PodPou,
  VolumeRange,
  Nldi,
  Overlays,
} from './filters';
import { MapTheme, MapGrouping, PointSize } from './display-options';
import { useNldiFilter } from './hooks/filters/useNldiFilter';
import { AllocationTypeSelect } from './filters/AllocationTypeSelect';
import { LegalStatusSelect } from './filters/LegalStatusSelect';
import { SiteTypeSelect } from './filters/SiteTypeSelect';

function SideBar() {
  const { resetUserOptions } = useWaterRightsContext();
  const { isNldiFilterActive, setNldiMapActiveStatus } = useNldiFilter();
  const [isWaterRightsFilterActive, setWaterRightsFilterActive] = useState(false);
  const [isOverlayFilterActive, setOverlayFilterActive] = useState(false);

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
    const keys = [...activeKeys].filter((a) => a !== 'nldi' && a !== 'siteSelectionFilters' && a !== 'overlayFilters');
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
  }, [activeKeys, isNldiFilterActive, isWaterRightsFilterActive, isOverlayFilterActive]);

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
              <label className="fw-bold">OVERLAY FILTER {isOverlayFilterActive}</label>
              <div className="px-1">
                <BootstrapSwitchButton checked={isOverlayFilterActive} onstyle="primary" offstyle="secondary" />
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Overlays />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="siteSelectionFilters">
            <Accordion.Header onClick={toggleWaterRightFilters}>
              <label className="fw-bold">WATER RIGHT SELECTION {isWaterRightsFilterActive}</label>
              <div className="px-1">
                <BootstrapSwitchButton checked={isWaterRightsFilterActive} onstyle="primary" offstyle="secondary" />
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <a
                  href="https://westernstateswater.org/wade/westdaat-filter-documentation/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn about WestDAAT filters
                </a>
              </div>
              <StatesSelect />
              <BeneficialUseSelect />
              <WaterSourceTypesSelect />
              <AllocationOwnerSearch />
              <OwnerClassificationType />
              <AllocationTypeSelect />
              <LegalStatusSelect />
              <SiteTypeSelect />
              <RiverBasinSelect />
              <SiteContent />
              <PriorityDateRange />
              <FlowRange />
              <VolumeRange />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="nldi">
            <Accordion.Header onClick={toggleNldiFilterStatus}>
              <label className="fw-bold">NLDI FILTER {isNldiFilterActive}</label>
              <div className="px-5">
                <BootstrapSwitchButton checked={isNldiFilterActive} onstyle="primary" offstyle="secondary" />
              </div>
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
              <Nldi />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default SideBar;
