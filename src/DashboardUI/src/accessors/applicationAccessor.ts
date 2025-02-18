import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { EstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseRequest';
import { FundingOrganizationDetails } from '../data-contracts/FundingOrganizationDetails';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import westDaatApi from './westDaatApi';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { WaterConservationApplicationCreateRequest } from '../data-contracts/WaterConservationApplicationCreateRequest';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';
import { convertGeometryToWkt } from '../utilities/geometryWktConverter';
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

export const getFundingOrganizationDetails = (
  context: IMsalContext,
  waterRightNativeId: string,
): Promise<FundingOrganizationDetails> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fundingOrganizationId: 'F3D1124F-9387-4C11-915E-32E9C3CF0156',
        fundingOrganizationName: 'Colorado River Basin',
        openEtModel: 'eeMETRIC',
        dateRangeStart: new Date(2024, 0, 1),
        dateRangeEnd: new Date(2024, 11, 31),
        compensationRateModel: 'You will be paid $300 per acre-foot. The commission will pay [Lorem ipsum...]',
      });
    }, 3000);
  });
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
    waterRightNativeId: string;
    model: RasterTimeSeriesModel;
    dateRangeStart: Date;
    dateRangeEnd: Date;
    polygons: Feature<Geometry, GeoJsonProperties>[];
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
): Promise<EstimateConsumptiveUseResponse> => {
  const request: EstimateConsumptiveUseRequest = {
    waterConservationApplicationId: fields.waterConservationApplicationId,
    waterRightNativeId: fields.waterRightNativeId,
    model: fields.model,
    dateRangeStart: fields.dateRangeStart,
    dateRangeEnd: fields.dateRangeEnd,
    polygons: fields.polygons.map((polygon) => convertGeometryToWkt(polygon.geometry)),
    compensationRateDollars: fields.compensationRateDollars,
    units: fields.units,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<EstimateConsumptiveUseResponse>('Applications/EstimateConsumptiveUse', request);

  return data;
};
