import { OverlayTooltip } from '../../../components/OverlayTooltip';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface SidebarElementProps {
  title: string;
  isLoading?: boolean;
  tooltip?: string;
  children?: React.ReactNode;
}

export function SidebarElement(props: SidebarElementProps) {
  return (
    <div className="estimation-tool-sidebar-element mb-4">
      <div className="position-relative">
        <span className="fs-5 fw-bold element-title">{props.title}</span>

        <div className="d-inline position-absolute right-0 bottom-0">
          <span className="d-inline element-icon">
            {props.tooltip && <OverlayTooltip text={props.tooltip} placement="right" />}
          </span>
        </div>
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
