export const nldi = {
  colors: {
    mapMarker: '#FF0000',
    mainstem: '#56B4E9',
    tributaries: '#56B4E9',
    wade: '#009E73',
    usgs: '#0072B2',
    epa: '#D55E00',
    unknown: '#CC79A7',
    riverBasin: '#088',
    sitePOD: '#00CEFF',
    sitePOU: '#32CD32',
  },
  latLongPrecision: 4,
};

export const pointSizes = {
  minPointSize: 2,
  minPointSizeZoomLevel: 5,
  maxPointSize: 20,
  maxPointSizeZoomLevel: 20,
  maxScaleFactorForSizedPoints: 10,
};

export enum waterRightsProperties {
  owners = 'o',
  ownerClassifications = 'oClass',
  beneficialUses = 'bu',
  siteUuid = 'uuid',
  sitePodOrPou = 'podPou',
  waterSourceTypes = 'wsType',
  states = 'st',
  exemptOfVolumeFlowPriority = 'xmpt',
  minFlowRate = 'minFlow',
  maxFlowRate = 'maxFlow',
  minVolume = 'minVol',
  maxVolume = 'maxVol',
  minPriorityDate = 'minPri',
  maxPriorityDate = 'maxPri',
  allocationTypes = 'allocType',
  legalStatuses = 'ls',
  siteTypes = 'sType',
}

export enum overlayProperties {
  overlayType = 'oType'
}

export enum nldiSiteProperties {
  sourceName = 'sourceName',
  identifier = 'identifier',
  uri = 'uri',
  name = 'name',
}

export const colorList = [
  '#006400',
  '#9ACD32',
  '#FF00E6',
  '#0000FF',
  '#32CD32',
  '#FF4500',
  '#9370DB',
  '#00FFFF',
  '#FF69B4',
  '#800080',
  '#00BFFF',
  '#FFD700',
  '#A52A2A',
  '#4B0082',
  '#ACACAC',
  '#FFA500',
  '#D2691E',
  '#FFC0CB',
  '#F0FFF0',
  '#F5DEB3',
  '#FF0000',
  '#19545F',
  '#5B2C15',
  '#50514D',
  '#00A277',
  '#B11D6C',
];

export const overlaysColorList = [
  '#99FF99',
  '#FF9999',
  '#9999FF',
  '#FF99FF',
  '#FFFF99',
  '#99FFFF',
  '#FFB380',
  '#C8A2C8',
];
