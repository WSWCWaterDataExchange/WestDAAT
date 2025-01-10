import React from 'react';
import { Form } from 'react-bootstrap';
import { useOverlaysFilter } from '../hooks/filters/useOverlaysFilter';

export function Overlays() {
  const {
    isOverlayFilterActive,
    overlaysData,
    overlays,
    toggleOverlay,
  } = useOverlaysFilter();

  if (!overlaysData) {
    return <div>Loading overlays...</div>;
  }

  return (
    <div className="position-relative flex-grow-1">
      <h5 className="fw-bold">OVERLAY INFO</h5>
      <div className="mb-3">
        <label className="form-label fw-bolder">Overlay Type</label>
        {overlaysData.map((overlayKey) => {
          const checked = overlays.includes(overlayKey);
          return (
            <Form.Group className="mb-3" key={overlayKey}>
              <Form.Check
                className="toggle"
                type="switch"
                id={`overlay-${overlayKey}`}
                label={overlayKey}
                checked={checked}
                onChange={(e) => toggleOverlay(overlayKey, e.target.checked)}
                disabled={!isOverlayFilterActive}
              />
            </Form.Group>
          );
        })}
      </div>
    </div>
  );
}

export default Overlays;
