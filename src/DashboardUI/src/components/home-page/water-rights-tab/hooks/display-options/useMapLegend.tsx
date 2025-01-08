import React, { useEffect } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useWadeLegend as useWadeMapLegend } from './useWadeMapLegend';
import { useNldiMapLegend } from './useNldiMapLegend';
import { useOverlayTypeLegend } from './useOverlayTypeLegend';

export function useMapLegend() {
  const { setLegend } = useMapContext();

  const { legendItems: overlayLegendItems } = useOverlayTypeLegend();
  const { legendItems: wadeLegendItems } = useWadeMapLegend();
  const { legendItems: nldiLegendItems } = useNldiMapLegend();

  useEffect(() => {
    const legendContent = (
      <div>
        {overlayLegendItems && (
          <div className="mb-3">
            <h5><strong>Overlay Info</strong></h5>
            {overlayLegendItems}
          </div>
        )}

        {wadeLegendItems && (
          <div className="mb-3">
            <h5><strong>Beneficial Use</strong></h5>
            {wadeLegendItems}
          </div>
        )}

        {nldiLegendItems && (
          <div className="mb-3">
            <h5><strong>NLDI Legend</strong></h5>
            {nldiLegendItems}
          </div>
        )}
      </div>
    );

    setLegend(legendContent);
  }, [setLegend, overlayLegendItems, wadeLegendItems, nldiLegendItems]);
}
