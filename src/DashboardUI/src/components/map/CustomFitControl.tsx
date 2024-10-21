import React from 'react';
import { mdiFitToScreenOutline } from "@mdi/js";
import { CustomMapControl } from "./CustomMapControl";


export class CustomFitControl extends CustomMapControl {
  constructor(handleMapFitChange: () => void) {
    super(mdiFitToScreenOutline,
      "Fit data on map",
      handleMapFitChange);
  }
}
