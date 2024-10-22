import { useCallback } from 'react';
import { useWaterRightsContext } from '../../Provider';

export function usePointSizeDisplayOption() {
  const {
    displayOptions: { pointSize },
    setDisplayOptions,
  } = useWaterRightsContext();

  const setPointSize = useCallback(
    (pointSize: string) => {
      setDisplayOptions((s) => ({
        ...s,
        pointSize: pointSize === 'f' ? 'f' : pointSize === 'v' ? 'v' : 'd',
      }));
    },
    [setDisplayOptions],
  );

  return { pointSize, setPointSize };
}
