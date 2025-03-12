import { IMsalContext } from '@azure/msal-react/dist/MsalContext';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { ApplicationDocument } from '../data-contracts/ApplicationDocuments';
import { BlobUpload } from '../data-contracts/BlobUpload';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { EstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseRequest';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { OrganizationApplicationDashboardLoadRequest } from '../data-contracts/OrganizationApplicationDashboardLoadRequest';
import { OrganizationApplicationDashboardLoadResponse } from '../data-contracts/OrganizationApplicationDashboardLoadResponse';
import { WaterConservationApplicationCreateRequest } from '../data-contracts/WaterConservationApplicationCreateRequest';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';
import { ContainerName, uploadFilesToBlobStorage } from '../utilities/fileUploadHelpers';
import { generateSasTokens } from './fileAccessor';
import westDaatApi from './westDaatApi';

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
    waterRightNativeId: string;
    polygonWkts: string[];
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
): Promise<EstimateConsumptiveUseResponse> => {
  const request: EstimateConsumptiveUseRequest = {
    waterConservationApplicationId: fields.waterConservationApplicationId,
    waterRightNativeId: fields.waterRightNativeId,
    polygons: fields.polygonWkts,
    compensationRateDollars: fields.compensationRateDollars,
    units: fields.units,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<EstimateConsumptiveUseResponse>('Applications/EstimateConsumptiveUse', request);

  return data;
};

export const uploadApplicationDocuments = async (
  context: IMsalContext,
  files: File[],
): Promise<ApplicationDocument[]> => {
  const sasTokens = (await generateSasTokens(context, files.length)).sasTokens;
  const applicationDocuments: ApplicationDocument[] = [];
  const blobUploads: BlobUpload[] = [];
  files.forEach((file, index) => {
    applicationDocuments.push({
      fileName: file.name,
      blobName: sasTokens[index].blobname,
    });
    blobUploads.push({
      data: file,
      contentLength: file.size,
      blobname: sasTokens[index].blobname,
      hostname: sasTokens[index].hostname,
      sasToken: sasTokens[index].sasToken,
    });
  });
  await uploadFilesToBlobStorage(ContainerName.ApplicationDocuments, blobUploads);
  return applicationDocuments;
};
