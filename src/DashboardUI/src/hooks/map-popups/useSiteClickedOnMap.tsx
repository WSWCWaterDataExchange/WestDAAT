import { useMemo } from 'react';
import { overlayProperties, waterRightsProperties, nldiSiteProperties } from '../../config/constants';
import useMapPopupOnClick from './useMapPopupOnClick';
import { NldiSiteData } from './useNldiClickedOnMap';

export type ProcessedFeature =
  | { type: 'site'; siteUuid: string }
  | { type: 'overlay'; siteUuid: string; oType: string }
  | { type: 'nldi'; nldiData: NldiSiteData };

function useSiteClickedOnMap() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();

  const features: ProcessedFeature[] = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) return [];

    const uniqueFeatures = new Map<string, ProcessedFeature>();
    clickedFeatures.forEach((feature) => {
      const props = feature.properties || {};
      const siteUuid = props[waterRightsProperties.siteUuid as string];
      const oType = props[overlayProperties.overlayType as string];

      if (props[nldiSiteProperties.sourceName]) {
        const nldiData = getNldiSite(props);
        if (props.source === 'wade_timeseries') {
          nldiData.isTimeSeries = true;
        }
        const key = `nldi-${nldiData.identifier}`;
        if (!uniqueFeatures.has(key)) {
          uniqueFeatures.set(key, { type: 'nldi', nldiData });
        }
      } else if (oType && siteUuid) {
        const key = `overlay-${siteUuid}-${oType}`;
        if (!uniqueFeatures.has(key)) {
          uniqueFeatures.set(key, { type: 'overlay', siteUuid, oType });
        }
      } else if (siteUuid) {
        const key = `site-${siteUuid}`;
        if (!uniqueFeatures.has(key)) {
          uniqueFeatures.set(key, { type: 'site', siteUuid });
        }
      }
    });

    return Array.from(uniqueFeatures.values());
  }, [clickedFeatures]);

  return { updatePopup, features };
}

function getNldiSite(props: { [key: string]: any }): NldiSiteData {
  return {
    sourceName: props[nldiSiteProperties.sourceName],
    identifier: props[nldiSiteProperties.identifier],
    name: props[nldiSiteProperties.name],
    uri: props[nldiSiteProperties.uri],
    isTimeSeries: false,
  };
}

export default useSiteClickedOnMap;
