export const features = {
  conservationEstimationTool: process.env.REACT_APP_FEATURE_CONSERVATION_ESTIMATION_TOOL === 'enabled',
};

export const isFeatureEnabled = (feature: keyof typeof features): boolean => {
  return features[feature];
};
