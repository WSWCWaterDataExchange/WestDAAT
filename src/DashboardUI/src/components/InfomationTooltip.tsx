import React from 'react';
import { mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface InformationTooltipProps {
  tooltipContents: JSX.Element;
}
export function InformationTooltip(props: InformationTooltipProps) {
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const { tooltipContents } = props;
  const tooltip = (
    <Tooltip onClick={() => setIsForcedOpen(false)}>{tooltipContents}</Tooltip>
  );
  return (
    <span onClick={() => setIsForcedOpen(!isForcedOpen)}>
      <OverlayTrigger overlay={tooltip} show={isForcedOpen || undefined}>
        <Icon
          path={mdiInformationOutline}
          size="1em"
          className="align-text-bottom"
        />
      </OverlayTrigger>
    </span>
  );
}
