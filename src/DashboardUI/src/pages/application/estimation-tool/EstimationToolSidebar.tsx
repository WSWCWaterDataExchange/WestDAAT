import { MapThemeSelector } from '../../../components/map/MapThemeSelector';
import Icon from '@mdi/react';
import { mdiPiggyBank, mdiWater } from '@mdi/js';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import {
  CompensationRateUnits,
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsOptions,
} from '../../../data-contracts/CompensationRateUnits';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useRef } from 'react';
import { formatNumber } from '../../../utilities/valueFormatters';
import { SidebarElement } from './SidebarElement';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

interface EstimationToolSidebarProps {
  perspective: ApplicationReviewPerspective;
  isLoading: boolean;
  loadFailed: boolean;
}

export function EstimationToolSidebar(props: EstimationToolSidebarProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const navigate = useNavigate();
  const desiredDollarsRef = useRef<HTMLInputElement>(null);
  const desiredUnitsRef = useRef<HTMLSelectElement>(null);

  const onEstimationFormChanged = () => {
    let desiredDollars: number | undefined = Number(desiredDollarsRef.current!.value);
    if (desiredDollars === 0 || isNaN(desiredDollars)) {
      desiredDollars = undefined;
    }

    const desiredUnitsAsEnum: CompensationRateUnits = Number(desiredUnitsRef.current?.value) as CompensationRateUnits;
    const desiredUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined =
      desiredUnitsAsEnum === CompensationRateUnits.None ? undefined : desiredUnitsAsEnum;

    dispatch({
      type: 'ESTIMATION_FORM_UPDATED',
      payload: {
        desiredCompensationDollars: desiredDollars,
        desiredCompensationUnits: desiredUnits,
      },
    });
  };

  const navigateToCreateApplicationPage = () => {
    navigate(`/application/${state.conservationApplication.waterConservationApplicationId}/create`);
  };

  return (
    <div className="flex-grow-1 panel-content">
      <div className="container-fluid pt-3 px-3">
        <SidebarElement title="CALCULATED SHAPE AREA FOR ALL IRRIGATED FIELDS">
          <div>
            <span className="fs-5 fw-bold et-blue-text">
              {formatNumber(state.conservationApplication.polygonAcreageSum, 2)} Acres
            </span>
          </div>

          <div>
            <span className="text-muted">Note: Polygons must be smaller than 50,000 acres.</span>
          </div>
        </SidebarElement>

        <SidebarElement
          title="FUNDING ORGANIZATION"
          tooltip="The Conservation Organization (or program sponsor) is the entity (governmental, nonprofit, or private) with a voluntary program to conserve or reduce water use with funding to compensate water users for relinquishing or abstaining from the use of their state water right. Conservation Organization decide on the following parameters: (a) the OpenET consumptive use model(s) or ensemble to use; (b) the time period (i.e., number of years and start and end months) used to evaluate historical consumptive use; and (c) the compensation in U.S. dollars per acre or per acre-foot of conserved water offered a user."
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <span>{state.conservationApplication.fundingOrganizationName}</span>
        </SidebarElement>

        <SidebarElement
          title="OpenET MODEL"
          tooltip="OpenET uses a combination of satellite data, weather data, and crop-specific information to estimate evapotranspiration (ET) rates for different land cover types. OpenET provides data from multiple models that are used to calculate ET and also provides a single ET value, or “ensemble value,” from those models for each location. Each model has its own strengths and limitations for different geographies, crops, and conditions. Which model used is determined by the Funding Organization(s) for their desired purpose."
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <span>{state.conservationApplication.openEtModelName}</span>
        </SidebarElement>

        <div className="d-print-none">
          <SidebarElement title="MAP LAYER">
            <div className="mt-2">
              <MapThemeSelector />
            </div>
          </SidebarElement>
        </div>

        <SidebarElement
          title="ESTIMATED CONSUMPTIVE USE"
          tooltip="Estimated Consumptive Use refers to the portion of diverted water that is consumed and not returned to the source, typically through evapotranspiration (ET), which is determined by the selected OpenET Model."
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <span>
            {state.conservationApplication.dateRangeStart?.toLocaleDateString()} to{' '}
            {state.conservationApplication.dateRangeEnd?.toLocaleDateString()}
          </span>
        </SidebarElement>

        <SidebarElement
          title="AVERAGE HISTORICAL TOTAL CONSUMPTIVE USE (DEPLETION)"
          tooltip="Average Historical Total Consumptive Use (Depletion) refers to the average historical recorded amount of water use recorded by the state (if available). Consumed use is the portion of water not returned to the source over a defined historical period. This includes water lost through evapotranspiration, plant uptake, and other consumptive processes, helping to assess water rights, allocations, and conservation planning."
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <div>
            <span className="text-muted">Across one or many fields</span>
          </div>

          <div className="d-flex align-items-center my-2">
            {(state.conservationApplication.cumulativeTotalEtInAcreFeet ?? 0) > 0 ? (
              <>
                <span className="me-1">
                  <Icon path={mdiWater} size="1.5em" className="estimate-tool-water-icon" />
                </span>
                <span className="fs-5 fw-bold et-blue-text">
                  {formatNumber(state.conservationApplication.cumulativeTotalEtInAcreFeet, 2)} Acre-Feet
                </span>
              </>
            ) : (
              <span className="text-muted">
                Please draw one or more polygons on the map to estimate the consumptive use.
              </span>
            )}
          </div>
        </SidebarElement>

        <SidebarElement
          title="CONSERVATION ORGANIZATION COMPENSATION RATE"
          tooltip="Conservation Organization Compensation Rate refers to the rate at which a Conservation Organization compensates water rights holders for reducing their consumptive water use. This rate is typically based on factors like water savings, market value, regional demand, and environmental benefits to support sustainable water management.
Conservation Estimate: Conservation Estimate refers to the projected monetary ($) value offered by the Funding Organization(s) to applicants as compensation for their voluntary efforts in water use reduction resulting from conservation measures, such as improved irrigation efficiency, crop selection, or temporary fallowing.
"
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <span className="text-muted">{state.conservationApplication.compensationRateModel}</span>
        </SidebarElement>

        <SidebarElement
          title="DESIRED COMPENSATION ($)"
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          <span className="text-muted">
            Input values below to estimate the amount of savings you may be eligible for
          </span>

          <Form onChange={onEstimationFormChanged} noValidate>
            <div className="d-flex d-print-block justify-content-between align-items-center gap-3">
              <InputGroup>
                <InputGroup.Text id="dollar-sign-addon">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder=""
                  min={1}
                  aria-describedby="dollar-sign-addon"
                  aria-label="Desired compensation in dollars"
                  defaultValue={state.conservationApplication.desiredCompensationDollars}
                  ref={desiredDollarsRef}
                  disabled={props.perspective !== 'applicant'}
                ></Form.Control>
              </InputGroup>

              <Form.Select
                aria-label="Desired compensation units"
                defaultValue={state.conservationApplication.desiredCompensationUnits}
                ref={desiredUnitsRef}
                disabled={props.perspective !== 'applicant'}
              >
                <option value={0}>Select an option</option>
                {CompensationRateUnitsOptions.map((value) => (
                  <option key={value} value={value}>
                    {CompensationRateUnitsLabelsPlural[value]}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form>
        </SidebarElement>

        <SidebarElement
          title="CONSERVATION ESTIMATE"
          tooltip="Conservation Estimate refers to the projected reduction in water use resulting from conservation measures, such as improved irrigation efficiency, crop selection, or temporary fallowing. This estimate helps assess potential water savings and informs compensation programs."
          isLoading={props.isLoading}
          isError={props.loadFailed}
          errorText="Failed to load details. Please try again later."
        >
          {state.conservationApplication.conservationPayment !== undefined ? (
            <>
              <div>
                <span className="text-muted">Based on the given information, we estimate you may be eligible for</span>
              </div>

              <div>
                <span className="fs-5 d-flex align-items-center estimate-tool-conservation-estimate-text">
                  <Icon path={mdiPiggyBank} size="1.25em" className="me-1 my-2" />

                  <span className="fs-5 fw-bold">
                    ${formatNumber(state.conservationApplication.conservationPayment, 0)}
                  </span>
                </span>
              </div>

              <div>
                <div>
                  <span className="text-muted">This estimate is not legally binding to WSWC.</span>
                </div>
                <div>
                  <a href="https://westernstateswater.org/wade/westcat/" target="_blank" rel="noreferrer">
                    Learn more
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div>
              <span className="text-muted">Please input desired compensation to be provided with an estimate</span>
            </div>
          )}
        </SidebarElement>

        {props.perspective === 'applicant' && (
          <SidebarElement>
            <div className="mb-3">
              <Button
                variant="primary"
                className="w-100"
                disabled={!state.canContinueToApplication}
                onClick={navigateToCreateApplicationPage}
              >
                Continue to Application
              </Button>
            </div>
            <div>
              <span className="text-muted">
                If you own this water right or have legal authority over the use of its water, you may apply to a water
                conservation program for compensated, temporary, and voluntary measure. Pending verification and
                approval by appropriate parties.
              </span>
            </div>
          </SidebarElement>
        )}
      </div>
    </div>
  );
}
