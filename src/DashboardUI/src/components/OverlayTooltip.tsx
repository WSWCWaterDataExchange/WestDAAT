import { mdiHelpCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Popover from 'react-bootstrap/esm/Popover';

import './OverlayTooltip.scss';

interface OverlayTooltipProps {
  text: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const OverlayTooltip = (props: OverlayTooltipProps) => {
  const { text } = props;

  const overlayElement = (props: any) => (
    <Popover {...props}>
      <Popover.Body>{text}</Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      // `focus` allows keyboard / mobile users to see the tooltip
      trigger={['hover', 'focus']}
      placement={props.placement ?? 'left'}
      delay={{ show: 0, hide: 0 }}
      overlay={overlayElement}
    >
      <Icon path={mdiHelpCircleOutline} size="1.5em" className="overlay-tooltip-icon" />
    </OverlayTrigger>
  );
};
