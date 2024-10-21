import React from 'react';
import { ChangeEvent, useCallback } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { usePodPouFilter } from "../hooks/filters/usePodPouFilter";

const podPouRadios = [
  { name: 'All', value: '' },
  { name: 'Points of Diversion', value: 'POD' },
  { name: 'Places of Use', value: 'POU' },
];
export function PodPou() {
  const {podPou, setPodPou} = usePodPouFilter();

  const handlePodPouChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPodPou(e.target.value === "POD" || e.target.value === "POU" ? e.target.value : undefined);
  }, [setPodPou]);

  return <div className="mb-3">
           <label>Toggle View</label>
           <ButtonGroup className="w-100">
             {podPouRadios.map((radio, idx) => (
               <ToggleButton
                 className="zindexzero"
                 key={idx}
                 id={`podPouRadio-${idx}`}
                 type="radio"
                 variant="outline-primary"
                 name="podPouRadio"
                 value={radio.value}
                 checked={(podPou ?? '') === radio.value}
                 onChange={handlePodPouChange}
               >
                 {radio.name}
               </ToggleButton>
             ))}
           </ButtonGroup>
         </div>
}