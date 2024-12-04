import React, { useState, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

export function Overlays() {
  const [overlayFilters, setOverlayFilters] = useState({
    admin: true,
    regulatory: true,
    aquifer: true,
    huc: true,
  });

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setOverlayFilters((prevFilters) => ({
      ...prevFilters,
      [key]: e.target.checked,
    }));
  };

  return (
    <div className="position-relative flex-grow-1">
      <h5 className="fw-bold">OVERLAY INFO</h5>
      <div className="mb-3">
        <label className="form-label fw-bolder">Overlay Type</label>
        <Form.Group className="mb-3">
          <Form.Check
            className="toggle"
            type="switch"
            id="overlayAdmin"
            checked={overlayFilters.admin}
            onChange={(e) => handleToggleChange(e, 'admin')}
            label="Admin"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            className="toggle"
            type="switch"
            id="overlayRegulatory"
            checked={overlayFilters.regulatory}
            onChange={(e) => handleToggleChange(e, 'regulatory')}
            label="Regulatory"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            className="toggle"
            type="switch"
            id="overlayAquifer"
            checked={overlayFilters.aquifer}
            onChange={(e) => handleToggleChange(e, 'aquifer')}
            label="Aquifer"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            className="toggle"
            type="switch"
            id="overlayHuc"
            checked={overlayFilters.huc}
            onChange={(e) => handleToggleChange(e, 'huc')}
            label="HUC"
          />
        </Form.Group>
      </div>
    </div>
  );
}

export default Overlays;
