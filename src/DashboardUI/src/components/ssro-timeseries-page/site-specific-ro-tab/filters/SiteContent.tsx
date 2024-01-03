import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useIncludeExemptFilter } from "../hooks/filters/useIncludeExemptFilter";
import { ChangeEvent } from "react";
import { InformationTooltip } from "../../../InfomationTooltip";

const exemptMapping = new Map<boolean | undefined, '' | '0' | '1'>([
  [undefined, ''],
  [true, '1'],
  [false, '0'],
])
const exemptRadios = [
  { name: 'All', value: exemptMapping.get(undefined) ?? '' },
  { name: 'Unavailable', value: exemptMapping.get(true) ?? '1' },
  { name: 'Available', value: exemptMapping.get(false) ?? '0' }
];
const tooltip = (
  <>
    <em>Unavailable</em> indicates they dont have a priority date or flow/volume amounts. Either the state does not have them available in machine-readable formats, or the water right does not require or specify them due to distinct legal reasons.
  </>
);
export function SiteContent() {
  const {includeExempt, setIncludeExempt} = useIncludeExemptFilter();

  const handleExemptChange = (e: ChangeEvent<HTMLInputElement>) => {
    let result: boolean | undefined = undefined;
    if (e.target.value === "1") {
      result = true;
    } else if (e.target.value === "0") {
      result = false;
    }
    setIncludeExempt(result);
  }

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between">
        <label>Availability of Priority Date and Amounts</label>
        <InformationTooltip tooltipContents={tooltip} />
      </div>
      
      <ButtonGroup className="w-100">
        {exemptRadios.map((radio) => (<ToggleButton
          className="zindexzero"
          key={radio.value}
          id={`exemptRadio-${radio.value}`}
          type="radio"
          variant="outline-primary"
          name="exemptRadio"
          value={radio.value ?? ''}
          checked={exemptMapping.get(includeExempt) === radio.value}
          onChange={handleExemptChange}
        >
          {radio.name}
        </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  )
}