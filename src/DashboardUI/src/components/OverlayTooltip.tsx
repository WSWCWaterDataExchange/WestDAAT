import { mdiHelpCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

interface OverlayTooltipProps {
  text: string;
}

export const OverlayTooltip = (props: OverlayTooltipProps) => {
  const { text } = props;

  const overlayElement = (props: any) => (
    <Popover id="consumptive-use-btn-tooltip" {...props}>
      <Popover.Body>{text}</Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="hover" placement="left" delay={{ show: 0, hide: 0 }} overlay={overlayElement}>
      <Icon path={mdiHelpCircleOutline} size="1.5em" />
    </OverlayTrigger>
  );
};
