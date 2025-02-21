import { EstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseRequest';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import westDaatApi from './westDaatApi';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { WaterConservationApplicationCreateRequest } from '../data-contracts/WaterConservationApplicationCreateRequest';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';
import { IMsalContext } from '@azure/msal-react/dist/MsalContext';
import { OrganizationApplicationDashboardLoadResponse } from '../data-contracts/OrganizationApplicationDashboardLoadResponse';
import { OrganizationApplicationDashboardLoadRequest } from '../data-contracts/OrganizationApplicationDashboardLoadRequest';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { RasterTimeSeriesModel } from '../data-contracts/RasterTimeSeriesModel';

export const applicationSearch = async (
  msalContext: IMsalContext,
  organizationId: string | null,
): Promise<OrganizationApplicationDashboardLoadResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationApplicationDashboardLoadRequest = {
    $type: 'OrganizationApplicationDashboardLoadRequest',
    organizationIdFilter: organizationId,
  };

  const { data } = await api.post('Applications/Search', request);

  data.applications.forEach((app: ApplicationDashboardListItem) => {
    app.submittedDate = new Date(app.submittedDate);
  });

  return data;
};

export const createWaterConservationApplication = async (
  context: IMsalContext,
  fields: {
    fundingOrganizationId: string;
    waterRightNativeId: string;
  },
): Promise<WaterConservationApplicationCreateResponse> => {
  const request: WaterConservationApplicationCreateRequest = {
    fundingOrganizationId: fields.fundingOrganizationId,
    waterRightNativeId: fields.waterRightNativeId,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<WaterConservationApplicationCreateResponse>('Applications', request);
  return data;
};

export const estimateConsumptiveUse = async (
  context: IMsalContext,
  fields: {
    waterConservationApplicationId: string;
    fundingOrganizationId: string;
    waterRightNativeId: string;
    model: RasterTimeSeriesModel;
    dateRangeStart: Date;
    dateRangeEnd: Date;
    polygonWkts: string[];
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
): Promise<EstimateConsumptiveUseResponse> => {
  const request: EstimateConsumptiveUseRequest = {
    waterConservationApplicationId: fields.waterConservationApplicationId,
    fundingOrganizationId: fields.fundingOrganizationId,
    waterRightNativeId: fields.waterRightNativeId,
    model: fields.model,
    dateRangeStart: toDateOnlyString(fields.dateRangeStart),
    dateRangeEnd: toDateOnlyString(fields.dateRangeEnd),
    polygons: fields.polygonWkts,
    compensationRateDollars: fields.compensationRateDollars,
    units: fields.units,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<EstimateConsumptiveUseResponse>('Applications/EstimateConsumptiveUse', request);

  return data;
};

const toDateOnlyString = (date: Date): string => date.toISOString().split('T')[0];
