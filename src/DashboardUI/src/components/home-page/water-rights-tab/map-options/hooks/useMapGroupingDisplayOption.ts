import { useCallback } from 'react';
import { useWaterRightsContext } from '../../sidebar-filtering/Provider';
import { MapGrouping } from '../components/MapGroupingClass';
import { defaultDisplayOptions } from '../components/DisplayOptions';

export function useMapGroupingDisplayOption() {
  const {
    displayOptions: { mapGrouping },
    setDisplayOptions,
  } = useWaterRightsContext();

  const setMapGrouping = useCallback(
    (mapGrouping: MapGrouping | undefined) => {
      setDisplayOptions((s) => ({
        ...s,
        mapGrouping: mapGrouping ?? defaultDisplayOptions.mapGrouping,
      }));
    },
    [setDisplayOptions],
  );

  return { mapGrouping, setMapGrouping };
}
