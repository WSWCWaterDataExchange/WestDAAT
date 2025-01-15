import { MapGrouping } from './MapGroupingClass';

export interface DisplayOptions {
  pointSize: 'd' | 'f' | 'v';
  mapGrouping: MapGrouping;
}

export const defaultDisplayOptions: DisplayOptions = {
  pointSize: 'd',
  mapGrouping: MapGrouping.BeneficialUse,
};
