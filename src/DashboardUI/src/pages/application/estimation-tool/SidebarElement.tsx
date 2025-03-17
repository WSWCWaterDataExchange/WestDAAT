import { OverlayTooltip } from '../../../components/OverlayTooltip';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface SidebarElementProps {
  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export function SidebarElement(props: SidebarElementProps) {
  return (
    <div className="estimation-tool-sidebar-element mb-4">
      <div className="position-relative mb-1">
        <span className="fs-5 fw-bold element-title">{props.title}</span>

        <div className="d-inline position-absolute ms-2 d-print-none">
          <span className="d-inline element-icon">
            {props.tooltip && <OverlayTooltip text={props.tooltip} placement="right" />}
          </span>
        </div>
      </div>

      {props.isLoading && (
        <div>
          <Placeholder as="div" animation="wave">
            <Placeholder xs={8} className="me-2 rounded"></Placeholder>
          </Placeholder>
        </div>
      )}

      {props.isError && <div className="text-danger">{props.errorText}</div>}

      {!props.isLoading && !props.isError && <div>{props.children}</div>}
    </div>
  );
}
