import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Map from './Map';
import { MapContext } from './MapProvider';
import mapConfig from "../config/maps";
import { BeneficialUseChangeOption } from './BeneficialUseSelect';
import { AppContext } from '../AppProvider';

function WaterRightMap(){

  const defaultFilters = useMemo<WaterRightsFilters>(() => ({
    beneficialUses: undefined,
    ownerClassifications: undefined
  }), [])
  const { setUrlParam, getUrlParam } = useContext(AppContext);

  const [filters, setFilters] = useState<WaterRightsFilters>(getUrlParam<WaterRightsFilters>("wr") ?? defaultFilters);

  const {
    setVisibleLayers
  } = useContext(MapContext);

  interface WaterRightsFilters {
    beneficialUses?: string[],
    ownerClassifications?: string[]
  }

const allWaterRightsLayers = useMemo(() => [
    'agricultural',
    'aquaculture',
    'commercial',
    'domestic',
    'environmental',
    'fire',
    'fish',
    'flood',
    'heating',
    'industrial',
    'instream',
    'livestock',
    'mining',
    'municipal',
    'other',
    'power',
    'recharge',
    'recreation',
    'snow',
    'storage',
    'wildlife',
  ], []);

  const convertLayersToBeneficialUseOptions = useCallback((beneficialUses: string[]) => {
    const convertMapLayerToBeneficialUseChangeOption = (layer: { id: string, friendlyName: string, paint: any }): BeneficialUseChangeOption => {
      return {
        value: layer.id,
        label: layer.friendlyName,
        color: layer.paint?.["circle-color"] as string
      }
    }

    return beneficialUses.map(a => {
      let layer = mapConfig.layers.find(b => b.id === a);
      if (layer) {
        return convertMapLayerToBeneficialUseChangeOption(layer as { id: string, friendlyName: string, paint: any });
      }
      return undefined;
    }).filter(a => a !== undefined) as BeneficialUseChangeOption[];
  }, []);

  const availableOptions = useMemo(() => {
    return convertLayersToBeneficialUseOptions(allWaterRightsLayers);
  }, [allWaterRightsLayers, convertLayersToBeneficialUseOptions]);


  useEffect(() => {
    let visibleLayers = allWaterRightsLayers;
    if (filters.beneficialUses && filters.beneficialUses.length > 0) {
      visibleLayers = filters.beneficialUses;
    }
    setVisibleLayers(visibleLayers)
  }, [filters, allWaterRightsLayers, setVisibleLayers])

  return (
    <Map />
  )
}

export default WaterRightMap;