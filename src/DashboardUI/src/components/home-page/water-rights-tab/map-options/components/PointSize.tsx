import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { usePointSizeDisplayOption } from '../hooks/usePointSizeDisplayOption';
import { ChangeEvent } from 'react';

const pointSizeRadios: {
  name: 'Default' | 'Flow' | 'Volume';
  value: 'd' | 'f' | 'v';
}[] = [
  { name: 'Default', value: 'd' },
  { name: 'Flow', value: 'f' },
  { name: 'Volume', value: 'v' },
];

export function PointSize() {
  const { pointSize, setPointSize } = usePointSizeDisplayOption();

  const handlePointSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPointSize(e.target.value);
  };

  return (
    <div className="mb-3">
      <label>Toggle Point Size</label>
      <ButtonGroup className="w-100">
        {pointSizeRadios.map((radio) => (
          <ToggleButton
            className="zindexzero"
            key={radio.value}
            id={`pointSizeRadio-${radio.value}`}
            type="radio"
            variant="outline-primary"
            name="pointSizeRadio"
            value={radio.value}
            checked={radio.value === pointSize}
            onChange={handlePointSizeChange}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default PointSize;
