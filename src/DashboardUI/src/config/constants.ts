export const nldi = {
  colors: {
    mapMarker: "#007BFF",
    mainstem: "#56B4E9",
    tributaries: "#56B4E9",
    wade: "#009E73",
    usgs: "#0072B2",
    epa: "#D55E00",
    unknown: "#CC79A7",
    sitePOD: "#01579b",
    sitePOU: "#7cb342"
  },
  latLongPrecision: 4
}

export enum waterRightsProperties {
  owners = "o",
  ownerClassifications = "oClass",
  beneficialUses = "bu",
  siteUuid = "uuid",
  sitePodOrPou = "podPou",
  waterSourceTypes = "wsType",
  states = "st",
  minFlowRate = "minFlow",
  maxFlowRate = "maxFlow",
  minVolume = "minVol",
  maxVolume = "maxVol",
  minPriorityDate = "minPri",
  maxPriorityDate = "maxPri",
}