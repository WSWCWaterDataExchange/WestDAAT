import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Accordion, Form } from 'react-bootstrap';
import BeneficialUseSelect from './water-rights/components/BeneficialUseSelect';
import { useWaterRightsContext } from './Provider';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';

import { MapTheme }  from '../map-options/components/MapTheme';
import { PointSize } from '../map-options/components/PointSize';
import { MapGrouping } from '../map-options/components/MapGrouping';
import { useNldiFilter} from "./nldi/hooks/useNldiFilter";
import { AllocationTypeSelect } from './water-rights/components/AllocationTypeSelect';
import { LegalStatusSelect } from './water-rights/components/LegalStatusSelect';
import { SiteTypeSelect } from './water-rights/components/SiteTypeSelect';
import { useOverlaysFilter} from "./overlays/hooks/useOverlaysFilter";
import {PodPou} from "../map-options/components/PodPou";
import Overlays from "./overlays/components/Overlays";
import {StatesSelect} from "./water-rights/components/StatesSelect";
import {WaterSourceTypesSelect} from "./water-rights/components/WaterSourceTypesSelect";
import {AllocationOwnerSearch} from "./water-rights/components/AllocationOwnerSearch";
import {OwnerClassificationType} from "./water-rights/components/OwnerClassificationType";
import {RiverBasinSelect} from "./water-rights/components/RiverBasinSelect";
import {SiteContent} from "./water-rights/components/SiteContent";
import {PriorityDateRange} from "./water-rights/components/PriorityDateRange";
import {FlowRange} from "./nldi/components/FlowRange";
import {VolumeRange} from "./water-rights/components/VolumeRange";
import {Nldi} from "./nldi/components/Nldi";

function SideBar() {
  const { resetUserOptions } = useWaterRightsContext();
  const { isNldiFilterActive, setNldiMapActiveStatus } = useNldiFilter();
  const [isWaterRightsFilterActive, setWaterRightsFilterActive] = useState(false);
  const { isOverlayFilterActive, setOverlayFilterActive } = useOverlaysFilter();

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
              <Overlays />
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
              <Nldi />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default SideBar;
