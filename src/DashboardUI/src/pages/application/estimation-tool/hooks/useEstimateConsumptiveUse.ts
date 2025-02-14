import { useMutation } from 'react-query';
import { estimateConsumptiveUse } from '../../../../accessors/applicationAccessor';
import { CompensationRateUnits } from '../../../../data-contracts/CompensationRateUnits';
import { useMsal } from '@azure/msal-react';
import { EstimateConsumptiveUseResponse } from '../../../../data-contracts/EstimateConsumptiveUseResponse';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';

interface EstimateConsumptiveUseApiCallFields {
  waterConservationApplicationId: string | undefined;
  waterRightNativeId: string | undefined;
  model: number | undefined;
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
  polygonWkts: string[] | undefined;
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}

export function useEstimateConsumptiveUse() {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useMutation({
    mutationFn: async (fields: EstimateConsumptiveUseApiCallFields) => {
      validateFields(fields);

      const apiCallFields: Parameters<typeof estimateConsumptiveUse>[1] = {
        waterRightNativeId: fields.waterRightNativeId!,
        waterConservationApplicationId: fields.waterConservationApplicationId!,
        dateRangeStart: fields.dateRangeStart!,
        dateRangeEnd: fields.dateRangeEnd!,
        model: fields.model!,
        polygonWkts: fields.polygonWkts!,
        compensationRateDollars: fields.compensationRateDollars,
        units: fields.units,
      };

      return await estimateConsumptiveUse(context, apiCallFields);
    },
    onSuccess: (result: EstimateConsumptiveUseResponse) => {
      if (result) {
        dispatch({
          type: 'ESTIMATE_CONSUMPTIVE_USE_LOADED',
          payload: {
            totalAverageYearlyEtAcreFeet: result.totalAverageYearlyEtAcreFeet,
            conservationPayment: result.conservationPayment,
            dataCollections: result.dataCollections,
          },
        });
      }
    },
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
  });
}

const validateFields = (fields: EstimateConsumptiveUseApiCallFields) => {
  const isValid: boolean =
    !!fields.waterConservationApplicationId &&
    !!fields.waterRightNativeId &&
    !!fields.model &&
    !!fields.dateRangeStart &&
    !!fields.dateRangeEnd &&
    !!fields.polygonWkts &&
    fields.polygonWkts.length > 0; // compensation rate is optional
  if (!isValid) {
    throw new Error('Invalid fields');
  }
};
