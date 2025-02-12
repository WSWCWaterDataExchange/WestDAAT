import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { EstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseRequest';
import { FundingOrganizationDetails } from '../data-contracts/FundingOrganizationDetails';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import westDaatApi from './westDaatApi';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';

export const getFundingOrganizationDetails = (waterRightNativeId: string): Promise<FundingOrganizationDetails> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fundingOrganizationName: 'Colorado River Basin',
        openEtModel: 'eeMETRIC',
        dateRangeStart: new Date(2024, 0, 1),
        dateRangeEnd: new Date(2024, 11, 31),
        compensationRateModel: 'You will be paid $300 per acre-foot. The commission will pay [Lorem ipsum...]',
      });
    }, 3000);
  });
};

export const estimateConsumptiveUse = async (fields: {
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  model: number;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  polygons: Feature<Geometry, GeoJsonProperties>[];
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}): Promise<EstimateConsumptiveUseResponse> => {
  const request: EstimateConsumptiveUseRequest = {
    waterConservationApplicationId: fields.waterConservationApplicationId,
    waterRightNativeId: fields.waterRightNativeId,
    model: fields.model,
    dateRangeStart: fields.dateRangeStart,
    dateRangeEnd: fields.dateRangeEnd,
    polygons: fields.polygons.map((p) => JSON.stringify(p.geometry)), // todo: verify
    compensationRateDollars: fields.compensationRateDollars,
    units: fields.units,
  };

  const api = await westDaatApi();
  const { data } = await api.post<EstimateConsumptiveUseResponse>('applications/EstimateConsumptiveUse', request);

  return data;
};
