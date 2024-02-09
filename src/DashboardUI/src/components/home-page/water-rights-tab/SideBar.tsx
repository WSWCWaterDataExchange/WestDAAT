import { useCallback, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import { Accordion } from "react-bootstrap";
import BeneficialUseSelect from "./filters/BeneficialUseSelect";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { useWaterRightsContext } from "./Provider";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { AllocationOwnerSearch, StatesSelect, WaterSourceTypesSelect, OwnerClassificationType, RiverBasinSelect, SiteContent, PriorityDateRange, FlowRange, PodPou, VolumeRange, Nldi } from "./filters";
import { MapTheme, MapGrouping, PointSize } from "./display-options";
import { useNldiFilter } from "./hooks/filters/useNldiFilter";

function SideBar() {
  const {resetUserOptions} = useWaterRightsContext();
  const { isNldiFilterActive, setNldiMapActiveStatus} = useNldiFilter()
 
  const [activeKeys, setActiveKeys] = useState(isNldiFilterActive ? ["nldi"] : ["colorSizeTools", "siteSelectionFilters"]);

  const toggleNldiFilterStatus = useCallback(() => {
    setNldiMapActiveStatus(!isNldiFilterActive);
  }, [isNldiFilterActive, setNldiMapActiveStatus]);

  const setOpenAccordionKeys = useCallback((keys: AccordionEventKey) =>{
    if(keys === null || keys === undefined){
      setActiveKeys([]);
    } else if (Array.isArray(keys)){
      setActiveKeys(keys);
    } else {
      setActiveKeys([keys])
    }
  }, [setActiveKeys])
  const openAccordionKeys = useMemo(() =>{
    const keys = [...activeKeys].filter(a=>a!=="nldi");
    if(isNldiFilterActive){
      keys.push("nldi");
    }
    return keys
  }, [activeKeys, isNldiFilterActive])

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
          <Accordion.Item eventKey="">
            <Accordion.Header>WATER RIGHT SELECTION FILTERS</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <a href="https://westernstateswater.org/wade/westdaat-filter-documentation/" target="_blank" rel="noopener noreferrer">Learn about WestDAAT filters</a>
              </div>
              <StatesSelect  />
              <BeneficialUseSelect />
              <WaterSourceTypesSelect />
              <AllocationOwnerSearch />
              <OwnerClassificationType />
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
            <div className="px-4" style={{background:"ghostwhite"}}>
              <a className="h6" target="_blank" rel="noreferrer" href="https://westernstateswater.org/wade/westdaat-nldi-geoconnex-documentation/">Learn About NLDI-Geoconnex filter here</a>
              <label className="h6"><i>Search along the stream network using the Hydro Network-Linked Data Index (NLDI) and Geoconnex Frameworks</i></label>
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