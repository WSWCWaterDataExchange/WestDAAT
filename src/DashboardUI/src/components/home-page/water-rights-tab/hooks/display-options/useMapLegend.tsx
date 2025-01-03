import React, { useEffect } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useWadeLegend as useWadeMapLegend } from './useWadeMapLegend';
import { useNldiMapLegend } from './useNldiMapLegend';
import { useOverlayTypeLegend } from './useOverlayTypeLegend';

export function useMapLegend() {
  const { setLegend } = useMapContext();

  const { legendItems: wadeLegendItems } = useWadeMapLegend();
  const { legendItems: nldiLegendItems } = useNldiMapLegend();
  const { legendItems: overlayLegendItems } = useOverlayTypeLegend();

  useEffect(() => {
    setLegend(
      <>
        <h1>OVERLAY INFO</h1>
        {overlayLegendItems}

        <h1>BENEFICIAL USE</h1>
        {wadeLegendItems}

        {nldiLegendItems}
      </>
    );
  }, [setLegend, wadeLegendItems, nldiLegendItems, overlayLegendItems]);
}
