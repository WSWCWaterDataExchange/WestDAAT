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
    <div className="sidebar-element mb-4">
      <div className="d-flex align-items-center gap-3">
        {/* limit width so the tooltips align properly */}
        <div>
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
