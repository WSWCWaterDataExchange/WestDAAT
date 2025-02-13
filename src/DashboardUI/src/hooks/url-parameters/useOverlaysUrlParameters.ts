import { useEffect } from 'react';
import { useUrlParameters } from './useUrlParameters';
import { useOverlaysContext } from '../../components/home-page/water-rights-tab/sidebar-filtering/OverlaysProvider';

export function useOverlaysUrlParameters() {
  const { overlays, toggleOverlay, isOverlayFilterActive, setOverlayFilterActive } = useOverlaysContext();
  const { getParameter, setParameter } = useUrlParameters<string[]>('overlays', []);

  useEffect(() => {
    const urlOverlays = getParameter() ?? [];
    if (urlOverlays.length > 0) {
      urlOverlays.forEach((overlay) => toggleOverlay(overlay, true));
      setOverlayFilterActive(true);
    }
  }, [getParameter, toggleOverlay, setOverlayFilterActive]);

  useEffect(() => {
    if (isOverlayFilterActive) {
      setParameter(overlays);
    } else {
      setParameter(undefined);
    }
  }, [overlays, isOverlayFilterActive, setParameter]);
}
