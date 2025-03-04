import { useMemo } from 'react';
import { nldiSiteProperties } from '../../config/constants';
import useMapPopupOnClick from './useMapPopupOnClick';

export type NldiSiteData = {
  sourceName: string;
  identifier: string;
  name: string;
  uri: string;
  isTimeSeries?: boolean;
};

function useNldiClickedOnMap() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const nldiData = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) return undefined;
    const nldiFeature = clickedFeatures.find(
      (a) => a.properties && a.properties[nldiSiteProperties.sourceName as string],
    );
    if (!nldiFeature || !nldiFeature.properties) return undefined;

    const data = getNldiSite(nldiFeature.properties);
    if (nldiFeature.properties.source === 'wade_timeseries') {
      data.isTimeSeries = true;
    }
    return data;
  }, [clickedFeatures]);
  return { updatePopup, nldiData };
}
export default useNldiClickedOnMap;

function getNldiSite(nldiProperties: { [name: string]: any }): NldiSiteData {
  return {
    sourceName: nldiProperties[nldiSiteProperties.sourceName as string],
    identifier: nldiProperties[nldiSiteProperties.identifier as string],
    name: nldiProperties[nldiSiteProperties.name as string],
    uri: nldiProperties[nldiSiteProperties.uri as string],
  };
}
