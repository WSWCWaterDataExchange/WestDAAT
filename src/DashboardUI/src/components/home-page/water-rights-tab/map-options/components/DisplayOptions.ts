import { MapGroupingClass } from './MapGroupingClass';

export interface DisplayOptions {
  pointSize: 'd' | 'f' | 'v';
  mapGrouping: MapGroupingClass;
}

export const defaultDisplayOptions: DisplayOptions = {
  pointSize: 'd',
  mapGrouping: MapGroupingClass.BeneficialUse,
};
