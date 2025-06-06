import { useCallback, useEffect, useState } from 'react';
import { useGetWaterRightDataEnvelope } from '../../../../../hooks/queries';
import { useWaterRightsSearchCriteria } from './useWaterRightsSearchCriteria';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { getLatsLongsFromFeatureCollection } from '../../../../../utilities/geometryHelpers';

export function useMapFitRequested() {
  const [fitRequested, setFitRequested] = useState(false);
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const { data, isLoading, isError } = useGetWaterRightDataEnvelope(searchCriteria, { enabled: fitRequested });
  const { setMapBoundSettings } = useMapContext();

  const handleMapFitRequested = useCallback(() => {
    setFitRequested(true);
  }, [setFitRequested]);

  useEffect(() => {
    if (fitRequested && data) {
      setMapBoundSettings({
        LngLatBounds: getLatsLongsFromFeatureCollection(data),
        maxZoom: 12,
        padding: 25,
      });
      setFitRequested(false);
    }
  }, [fitRequested, data, setMapBoundSettings]);

  return { isLoading, isError, handleMapFitRequested };
}
