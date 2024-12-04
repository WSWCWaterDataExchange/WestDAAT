import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useWaterRightsContext } from '../Provider';

export function Overlays() {
  const { hostData } = useWaterRightsContext();
  const { data: overlaysData, isLoading, isError } = hostData.overlaysQuery;

  const [overlayFilters, setOverlayFilters] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (overlaysData) {
      const initialFilters = overlaysData.reduce((acc: { [key: string]: boolean }, overlay: string) => {
        acc[overlay] = true;
        return acc;
      }, {});
      setOverlayFilters(initialFilters);
    }
  }, [overlaysData]);

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setOverlayFilters((prevFilters) => ({
      ...prevFilters,
      [key]: e.target.checked,
    }));
  };

  if (isLoading) {
    return <div>Loading overlays...</div>;
  }

  if (isError) {
    return <div>Error loading overlays.</div>;
  }

  return (
      <div className="position-relative flex-grow-1">
        <h5 className="fw-bold">OVERLAY INFO</h5>
        <div className="mb-3">
          <label className="form-label fw-bolder">Overlay Type</label>
          {overlaysData &&
              overlaysData.map((overlay) => (
                  <Form.Group className="mb-3" key={overlay}>
                    <Form.Check
                        className="toggle"
                        type="switch"
                        id={`overlay${overlay}`}
                        checked={overlayFilters[overlay] || false}
                        onChange={(e) => handleToggleChange(e, overlay)}
                        label={overlay}
                    />
                  </Form.Group>
              ))}
        </div>
      </div>
  );
}

export default Overlays;
