import { useCallback } from 'react';
import { useWaterRightsContext } from '../../Provider';
import { MapGrouping } from '../../MapGrouping';
import { defaultDisplayOptions } from '../../DisplayOptions';

export function useMapGroupingDisplayOption() {
  const {
    displayOptions: { mapGrouping },
    setDisplayOptions,
  } = useWaterRightsContext();

  const setMapGrouping = useCallback(
    (mapGrouping: MapGrouping | undefined) => {
      setDisplayOptions((s) => ({
        ...s,
        mapGrouping: mapGrouping ?? defaultDisplayOptions.mapGroupin,
      }));
    },
    [setDisplayOptions,
  );

  return { mapGrouping, setMapGrouping };
}
