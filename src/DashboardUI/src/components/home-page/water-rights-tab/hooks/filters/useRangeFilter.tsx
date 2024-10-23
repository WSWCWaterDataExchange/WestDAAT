import { useCallback } from 'react';
import { useWaterRightsContext, WaterRightsFilters } from '../../Provider';
import { waterRightsProperties } from '../../../../../config/constants';
import { useRangeFilter as useRangeFilterBase } from '../../../../../hooks/filters/useRangeFilter';

type ValidRangeFilterFields =
  | 'maxFlow'
  | 'minFlow'
  | 'maxVolume'
  | 'minVolume'
  | 'minPriorityDate'
  | 'maxPriorityDate';
type ValidRangeWaterRightsProperties =
  | waterRightsProperties.minFlowRate
  | waterRightsProperties.maxFlowRate
  | waterRightsProperties.minVolume
  | waterRightsProperties.maxVolume
  | waterRightsProperties.minPriorityDate
  | waterRightsProperties.maxPriorityDate;
export function useRangeFilter<
  K1 extends keyof Pick<WaterRightsFilters, ValidRangeFilterFields>,
>(
  minField: K1,
  maxField: K1,
  minMapField: ValidRangeWaterRightsProperties,
  maxMapField: ValidRangeWaterRightsProperties,
) {
  const {
    filters: { [minField]: minValue, [maxField]: maxValue },
    setFilters,
  } = useWaterRightsContext();

  const { mapFilters } = useRangeFilterBase(
    minValue,
    maxValue,
    minMapField,
    maxMapField,
  );

  const setMinValue = useCallback(
    (value: typeof minValue) => {
      setFilters((s) => ({
        ...s,
        [minField]: value,
      }));
    },
    [minField, setFilters],
  );

  const setMaxValue = useCallback(
    (value: typeof maxValue) => {
      setFilters((s) => ({
        ...s,
        [maxField]: value,
      }));
    },
    [maxField, setFilters],
  );

  return { minValue, maxValue, setMinValue, setMaxValue, mapFilters };
}
