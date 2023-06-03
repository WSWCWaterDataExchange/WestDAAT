import { MapGrouping } from "./MapGrouping"

export interface DisplayOptions {
  pointSize: 'd' | 'f' | 'v',
  mapGrouping: MapGrouping
}

export const defaultDisplayOptions: DisplayOptions = {
  pointSize: 'd',
  mapGrouping: MapGrouping.BeneficialUse
}