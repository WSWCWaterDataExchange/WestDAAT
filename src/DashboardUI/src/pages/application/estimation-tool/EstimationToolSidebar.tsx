import { MapThemeSelector } from '../../../components/map/MapThemeSelector';
import { OverlayTooltip } from '../../../components/OverlayTooltip';
import Icon from '@mdi/react';
import { mdiPiggyBank, mdiWater } from '@mdi/js';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import {
  CompensationRateUnitsLabels,
  CompensationRateUnitsOptions,
} from '../../../data-contracts/CompensationRateUnits';
import { FundingOrganizationDetails } from '../../../data-contracts/FundingOrganizationDetails';
import { formatNumber } from '../../../utilities/valueFormatters';

interface EstimationToolSidebarProps {
  fundingOrganizationDetails: FundingOrganizationDetails | undefined;
  isLoadingFundingOrganization: boolean;
}

export function EstimationToolSidebar(props: EstimationToolSidebarProps) {
  const acreageSum = 4681;
  const evapotranspiration = 1000;
  const conservationEstimate = 15000;

  return (
    <div className="flex-grow-1 panel-content">
      <div className="container-fluid">
        <SidebarElement title="CALCULATED SHAPE AREA FOR ALL IRRIGATED FIELDS">
          <div>
            <span className="fs-5 fw-bold text-primary">{formatNumber(acreageSum, 2)} Acres</span>
          </div>

          <div>
            <span className="text-muted">Note: Polygons must be smaller than 50,000 acres.</span>
          </div>
        </SidebarElement>

        <SidebarElement
          title="FUNDING ORGANIZATION"
          tooltip="The Conservation Organization (or program sponsor) is the entity (governmental, nonprofit, or private) with a voluntary program to conserve or reduce water use with funding to compensate water users for relinquishing or abstaining from the use of their state water right. Conservation Organization decide on the following parameters: (a) the OpenET consumptive use model(s) or ensemble to use; (b) the time period (i.e., number of years and start and end months) used to evaluate historical consumptive use; and (c) the compensation in U.S. dollars per acre or per acre-foot of conserved water offered a user."
          isLoading={props.isLoadingFundingOrganization}
        >
          <span>{props.fundingOrganizationDetails?.fundingOrganizationName}</span>
        </SidebarElement>

        <SidebarElement
          title="OpenET Model"
          tooltip="OpenET uses a combination of satellite data, weather data, and crop-specific information to estimate evapotranspiration (ET) rates for different land cover types. OpenET provides data from multiple models that are used to calculate ET and also provides a single ET value, or “ensemble value,” from those models for each location. Each model has its own strengths and limitations for different geographies, crops, and conditions. Which model used is determined by the Funding Organization(s) for their desired purpose."
          isLoading={props.isLoadingFundingOrganization}
        >
          <span>{props.fundingOrganizationDetails?.openEtModel}</span>
        </SidebarElement>

        <SidebarElement title="MAP LAYER">
          <MapThemeSelector />
        </SidebarElement>

        <SidebarElement
          title="ESTIMATED CONSUMPTIVE USE"
          tooltip="Estimated Consumptive Use refers to the portion of diverted water that is consumed and not returned to the source, typically through evapotranspiration (ET), which is determined by the selected OpenET Model."
          isLoading={props.isLoadingFundingOrganization}
        >
          <span>
            {props.fundingOrganizationDetails?.dateRangeStart.toLocaleDateString()} to{' '}
            {props.fundingOrganizationDetails?.dateRangeEnd.toLocaleDateString()}
          </span>
        </SidebarElement>

        <SidebarElement
          title="AVERAGE HISTORICAL TOTAL CONSUMPTIVE USE (DEPLETION)"
          tooltip="Average Historical Total Consumptive Use (Depletion) refers to the average historical recorded amount of water use recorded by the state (if available). Consumed use is the portion of water nott returned to the source over a defined historical period. This includes water lost through evapotranspiration, plant uptake, and other consumptive processes, helping to assess water rights, allocations, and conservation planning."
          isLoading={props.isLoadingFundingOrganization}
        >
          <div>
            <span className="text-muted">Across one or many fields</span>
          </div>

          {/* todo empty state */}
          <div className="d-flex align-items-center">
            <span className="me-1">
              <Icon path={mdiWater} size="1.5em" className="estimate-tool-water-icon" />
            </span>
            <span className="fs-5 fw-bold text-primary">{formatNumber(evapotranspiration, 2)} Acre-Feet</span>
          </div>
        </SidebarElement>

        <SidebarElement
          title="CONSERVATION ORGANIZATION COMPENSATION RATE"
          tooltip="Conservation Organization Compensation Rate refers to the rate at which a Conservation Organization compensates water rights holders for reducing their consumptive water use. This rate is typically based on factors like water savings, market value, regional demand, and environmental benefits to support sustainable water management.
Conservation Estimate: Conservation Estimate refers to the projected monetary ($) value offered by the Funding Organization(s) to applicants as compensation for their voluntary efforts in water use reduction resulting from conservation measures, such as improved irrigation efficiency, crop selection, or temporary fallowing.
"
          isLoading={props.isLoadingFundingOrganization}
        >
          <span className="text-muted">{props.fundingOrganizationDetails?.compensationRateModel}</span>
        </SidebarElement>

        <SidebarElement title="DESIRED COMPENSATION ($)" isLoading={props.isLoadingFundingOrganization}>
          <span className="text-muted">
            Input values below to estimate the amount of savings you may be eligible for
          </span>

          <div className="d-flex justify-content-between align-items-center gap-3">
            <InputGroup>
              <InputGroup.Text id="dollar-sign-addon">$</InputGroup.Text>
              <Form.Control type="number" placeholder="600" min={1} aria-describedby="dollar-sign-addon"></Form.Control>
            </InputGroup>

            <Form.Select aria-label="Desired compensation units">
              <option>Select an option</option>
              {CompensationRateUnitsOptions.map((value) => (
                <option value={value}>{CompensationRateUnitsLabels[value]}</option>
              ))}
            </Form.Select>
          </div>
        </SidebarElement>

        <SidebarElement
          title="CONSERVATION ESTIMATE"
          tooltip="Conservation Estimate refers to the projected reduction in water use resulting from conservation measures, such as improved irrigation efficiency, crop selection, or temporary fallowing. This estimate helps assess potential water savings and informs compensation programs."
          isLoading={props.isLoadingFundingOrganization}
        >
          <div>
            <span className="text-muted">Based on the given information, we estimate you may be eligible for</span>
          </div>

          <div>
            <span className="fs-5 d-flex align-items-center estimate-tool-conservation-estimate-text">
              <Icon path={mdiPiggyBank} size="1.25em" className="me-1" />

              <span className="fs-5 fw-bold">${formatNumber(conservationEstimate, 2)}</span>
            </span>
          </div>

          <div>
            <div>
              <span className="text-muted">This estimate is not legally binding to WSWC.</span>
            </div>
            <div>
              <a href="#">Learn more</a>
            </div>
          </div>
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
          <Placeholder as="div" animation="wave">
            <Placeholder xs={8} className="me-2 rounded"></Placeholder>
          </Placeholder>
        </div>
      ) : (
        <div>{props.children}</div>
      )}
    </div>
  );
}
