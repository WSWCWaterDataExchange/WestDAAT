import { useCallback } from 'react';
import { colorList, overlaysColorList } from '../config/constants';

const fallbackColor = '#000000'; // Single fallback color for all cases

export function useColorMappings() {
  const getColorByIndex = useCallback((i: number) => {
    return colorList[i % colorList.length];
  }, []);

  const getOverlayColorByIndex = useCallback((i: number) => {
    return overlaysColorList[i % overlaysColorList.length];
  }, []);

  return {
    getColorByIndex,
    getOverlayColorByIndex,
    fallbackColor,
  };
}
