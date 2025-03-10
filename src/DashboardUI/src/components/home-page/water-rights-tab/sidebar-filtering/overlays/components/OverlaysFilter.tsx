import React from 'react';
import OverlayTypeSelect from './OverlayTypeSelect';
import OverlayStateSelect from './OverlayStateSelect';
import OverlayWaterSourceSelect from './OverlayWaterSourceSelect';

export function OverlaysFilter() {
  return (
    <div className="position-relative flex-grow-1">
      <OverlayTypeSelect />
      <OverlayStateSelect />
      <OverlayWaterSourceSelect />
    </div>
  );
}

export default OverlaysFilter;
