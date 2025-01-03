import React from 'react';
import { useEffect } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useWadeLegend as useWadeMapLegend } from './useWadeMapLegend';
import { useNldiMapLegend } from './useNldiMapLegend';

export function useMapLegend() {
  const { setLegend } = useMapContext();

  const { legendItems: wadeLegendItems } = useWadeMapLegend();
  const { legendItems: nldiLegendItems } = useNldiMapLegend();

  useEffect(() => {
    setLegend(
      <>
        <h1>OVERLAY INFO</h1>
        <h1>BENEFICIAL USE</h1>
        {wadeLegendItems}
        {nldiLegendItems}
      </>,
    );
  }, [setLegend, wadeLegendItems, nldiLegendItems]);
}
