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
        {wadeLegendItems}
        {nldiLegendItems}
      </>,
    );
  }, [setLegend, wadeLegendItems, nldiLegendItems]);
}
