import { useEffect, useState } from 'react';
import { MapThemeSelector } from '../../../components/map/MapThemeSelector';
import { OverlayTooltip } from '../../../components/OverlayTooltip';
import Icon from '@mdi/react';
import { mdiWater } from '@mdi/js';

export function EstimationToolSidebar() {
  // temporary loading state for testing
  const [isLoadingFundingOrganization, setIsLoadingFundingOrganization] = useState(true);

  // emulate loading state for testing
  useEffect(() => {
    if (isLoadingFundingOrganization) {
      setTimeout(() => {
        setIsLoadingFundingOrganization(false);
      }, 3000);
    }
  }, [isLoadingFundingOrganization]);

  const acreageSum = 0;
  const evapotranspiration = 0;
  return (
    <div className="flex-grow-1 panel-content">
      <div className="container-fluid">
        <SidebarElement title="CALCULATED SHAPE AREA FOR ALL IRRIGATED FIELDS">
          <div>
            <span className="fs-5 fw-bold text-primary">{acreageSum} Acres</span>
          </div>

          <div>
            <span className="text-muted">Note: Polygons must be smaller than 50,000 acres.</span>
          </div>
        </SidebarElement>

        <SidebarElement
          title="FUNDING ORGANIZATION"
          tooltip="Funding organizations provide financial incentives to water rights holders in exchange for modifying their water use. These entities—governmental, nonprofit, or private—support water conservation programs, water markets, and voluntary agreements to balance water availability for agriculture, ecosystems, and urban needs."
          isLoading={isLoadingFundingOrganization}
        >
          <span>Selected Funding Organization</span>
        </SidebarElement>

        <SidebarElement
          title="OpenET Model"
          tooltip="OpenET uses open-source models and Google Earth Engine to provide satellite-based information on water consumption in areas as small as a quarter of an acre at daily, monthly and yearly intervals."
          isLoading={isLoadingFundingOrganization}
        >
          <span>Selected OpenET Model</span>
        </SidebarElement>

        <SidebarElement title="MAP LAYER">
          <MapThemeSelector />
        </SidebarElement>

        <SidebarElement
          title="ESTIMATED CONSUMPTIVE USE"
          tooltip="Estimated Consumptive Use refers to the portion of diverted water that is consumed and not returned to the source, typically through evapotranspiration, plant uptake, or incorporation into products. It represents the actual water loss from the system and helps determine water availability for other uses."
          isLoading={isLoadingFundingOrganization}
        >
          <span>Selected date range</span>
        </SidebarElement>

        <SidebarElement
          title="AVERAGE HISTORICAL TOTAL CONSUMPTIVE USE (DEPLETION)"
          tooltip="Average Historic Total Consumptive Use (Depletion) refers to the long-term average amount of water consumed and not returned to the source over a defined historical period. This includes water lost through evapotranspiration, plant uptake, and other consumptive processes, helping to assess water rights, allocations, and conservation planning."
        >
          <div>
            <span className="text-muted">Across one or many fields</span>
          </div>

          {/* todo empty state */}
          <div className="d-flex align-items-center">
            <span className="me-1">
              <Icon path={mdiWater} size="1.5em" className="estimate-tool-water-icon" />
            </span>
            <span className="fs-5 fw-bold text-primary">{evapotranspiration} Acre-Feet</span>
          </div>
        </SidebarElement>

        <SidebarElement
          title="CONSERVATION ORGANIZATION COMPENSATION RATE"
          tooltip="Conservation Organization Compensation Rate refers to the rate at which a conservation organization compensates water rights holders for reducing their consumptive water use. This rate is typically based on factors like water savings, market value, regional demand, and environmental benefits to support sustainable water management."
        >
          placeholder
        </SidebarElement>

        <SidebarElement title="DESIRED COMPENSATION">placeholder</SidebarElement>

        <SidebarElement
          title="CONSERVATION ESTIMATE"
          tooltip="Conservation Estimate refers to the projected reduction in water use resulting from conservation measures, such as improved irrigation efficiency, crop selection, or temporary fallowing. This estimate helps assess potential water savings and informs compensation programs."
        >
          placeholder
        </SidebarElement>
      </div>
    </div>
  );
}

interface SidebarElementProps {
  title: string;
  isLoading?: boolean;
  tooltip?: string;
  children?: React.ReactNode;
}

function SidebarElement(props: SidebarElementProps) {
  return (
    <div className="sidebar-element mb-4">
      <div className="d-flex align-items-center gap-3">
        {/* limit width so the tooltips align properly */}
        <div className="w-75">
          <span className="fs-5 fw-bold">{props.title}</span>
        </div>
        {props.tooltip && <OverlayTooltip text={props.tooltip} placement="right" />}
      </div>

      {props.isLoading ? (
        <div>
          <div className="placeholder-wave">
            <span className="placeholder col-8 me-2"></span>
          </div>
        </div>
      ) : (
        <div>{props.children}</div>
      )}
    </div>
  );
}
