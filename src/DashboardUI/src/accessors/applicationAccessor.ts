import { IMsalContext } from '@azure/msal-react/dist/MsalContext';
import { ApplicantConservationApplicationLoadRequest } from '../data-contracts/ApplicantConservationApplicationLoadRequest';
import { ApplicantConservationApplicationLoadResponse } from '../data-contracts/ApplicantConservationApplicationLoadResponse';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { ApplicationDetails } from '../data-contracts/ApplicationDetails';
import { ApplicationDocument } from '../data-contracts/ApplicationDocuments';
import { ApplicationLoadRequestBase } from '../data-contracts/ApplicationLoadRequestBase';
import { ApplicationLoadResponseBase } from '../data-contracts/ApplicationLoadResponseBase';
import { ApplicationReviewNote } from '../data-contracts/ApplicationReviewNote';
import { ApplicationReviewPerspective } from '../data-contracts/ApplicationReviewPerspective';
import { ApplicationSubmissionFormData } from '../data-contracts/ApplicationSubmissionFormData';
import { BlobUpload } from '../data-contracts/BlobUpload';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { EstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseRequest';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { OrganizationApplicationDashboardLoadRequest } from '../data-contracts/OrganizationApplicationDashboardLoadRequest';
import { OrganizationApplicationDashboardLoadResponse } from '../data-contracts/OrganizationApplicationDashboardLoadResponse';
import { ReviewerConservationApplicationLoadRequest } from '../data-contracts/ReviewerConservationApplicationLoadRequest';
import { ReviewerConservationApplicationLoadResponse } from '../data-contracts/ReviewerConservationApplicationLoadResponse';
import { WaterConservationApplicationCreateRequest } from '../data-contracts/WaterConservationApplicationCreateRequest';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';
import { WaterConservationApplicationSubmissionRequest } from '../data-contracts/WaterConservationApplicationSubmissionRequest';
import { WaterConservationApplicationSubmissionUpdateRequest } from '../data-contracts/WaterConservationApplicationSubmissionUpdateRequest';
import { ContainerName, downloadFilesFromBlobStorage, uploadFilesToBlobStorage } from '../utilities/fileUploadHelpers';
import { generateDownloadSasToken, generateUploadSasTokens } from './fileAccessor';
import westDaatApi from './westDaatApi';
import { StorePolygonDetails } from '../data-contracts/StorePolygonDetails';

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
    polygons: StorePolygonDetails[];
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
): Promise<EstimateConsumptiveUseResponse> => {
  const request: EstimateConsumptiveUseRequest = {
    waterConservationApplicationId: fields.waterConservationApplicationId,
    waterRightNativeId: fields.waterRightNativeId,
    polygons: fields.polygons,
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
  const sasTokens = (await generateUploadSasTokens(context, files.length)).sasTokens;
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

export const downloadApplicationDocuments = async (context: IMsalContext, documentId: string): Promise<void> => {
  const { sasToken, fileName } = await generateDownloadSasToken(context, documentId);
  await downloadFilesFromBlobStorage(sasToken, fileName);
};

export const submitApplication = async (
  context: IMsalContext,
  data: {
    waterConservationApplicationId: string;
    waterRightNativeId: string;
    form: ApplicationSubmissionFormData;
    supportingDocuments: ApplicationDocument[];
  },
): Promise<void> => {
  const api = await westDaatApi(context);

  const request: WaterConservationApplicationSubmissionRequest = {
    waterConservationApplicationId: data.waterConservationApplicationId,
    waterRightNativeId: data.waterRightNativeId,
    agentName: data.form.agentName,
    agentEmail: data.form.agentEmail,
    agentPhoneNumber: data.form.agentPhoneNumber,
    agentAdditionalDetails: data.form.agentAdditionalDetails,
    landownerName: data.form.landownerName!,
    landownerEmail: data.form.landownerEmail!,
    landownerPhoneNumber: data.form.landownerPhoneNumber!,
    landownerAddress: data.form.landownerAddress!,
    landownerCity: data.form.landownerCity!,
    landownerState: data.form.landownerState!,
    landownerZipCode: data.form.landownerZipCode!,
    canalOrIrrigationEntityName: data.form.canalOrIrrigationEntityName,
    canalOrIrrigationEntityEmail: data.form.canalOrIrrigationEntityEmail,
    canalOrIrrigationEntityPhoneNumber: data.form.canalOrIrrigationEntityPhoneNumber,
    canalOrIrrigationAdditionalDetails: data.form.canalOrIrrigationAdditionalDetails,
    conservationPlanFundingRequestDollarAmount: data.form.conservationPlanFundingRequestDollarAmount!,
    conservationPlanFundingRequestCompensationRateUnits: data.form.conservationPlanFundingRequestCompensationRateUnits!,
    conservationPlanDescription: data.form.conservationPlanDescription!,
    conservationPlanAdditionalInfo: data.form.conservationPlanAdditionalInfo,
    estimationSupplementaryDetails: data.form.estimationSupplementaryDetails,
    permitNumber: data.form.permitNumber!,
    facilityDitchName: data.form.facilityDitchName!,
    priorityDate: data.form.priorityDate!,
    certificateNumber: data.form.certificateNumber!,
    shareNumber: data.form.shareNumber!,
    waterRightState: data.form.waterRightState!,
    waterUseDescription: data.form.waterUseDescription!,
    fieldDetails: data.form.fieldDetails,
    supportingDocuments: data.supportingDocuments,
  };

  await api.post<void>('Applications/Submit', request);
};

export const updateApplicationSubmission = async (
  context: IMsalContext,
  data: {
    waterConservationApplicationId: string;
    form: ApplicationSubmissionFormData;
    supportingDocuments: ApplicationDocument[];
    note: string;
  },
): Promise<void> => {
  const api = await westDaatApi(context);

  const request: WaterConservationApplicationSubmissionUpdateRequest = {
    agentName: data.form.agentName,
    agentEmail: data.form.agentEmail,
    agentPhoneNumber: data.form.agentPhoneNumber,
    agentAdditionalDetails: data.form.agentAdditionalDetails,
    landownerName: data.form.landownerName!,
    landownerEmail: data.form.landownerEmail!,
    landownerPhoneNumber: data.form.landownerPhoneNumber!,
    landownerAddress: data.form.landownerAddress!,
    landownerCity: data.form.landownerCity!,
    landownerState: data.form.landownerState!,
    landownerZipCode: data.form.landownerZipCode!,
    canalOrIrrigationEntityName: data.form.canalOrIrrigationEntityName,
    canalOrIrrigationEntityEmail: data.form.canalOrIrrigationEntityEmail,
    canalOrIrrigationEntityPhoneNumber: data.form.canalOrIrrigationEntityPhoneNumber,
    canalOrIrrigationAdditionalDetails: data.form.canalOrIrrigationAdditionalDetails,
    conservationPlanFundingRequestDollarAmount: data.form.conservationPlanFundingRequestDollarAmount!,
    conservationPlanFundingRequestCompensationRateUnits: data.form.conservationPlanFundingRequestCompensationRateUnits!,
    conservationPlanDescription: data.form.conservationPlanDescription!,
    conservationPlanAdditionalInfo: data.form.conservationPlanAdditionalInfo,
    estimationSupplementaryDetails: data.form.estimationSupplementaryDetails,
    permitNumber: data.form.permitNumber!,
    facilityDitchName: data.form.facilityDitchName!,
    priorityDate: data.form.priorityDate!,
    certificateNumber: data.form.certificateNumber!,
    shareNumber: data.form.shareNumber!,
    waterRightState: data.form.waterRightState!,
    waterUseDescription: data.form.waterUseDescription!,
    fieldDetails: data.form.fieldDetails,
    supportingDocuments: data.supportingDocuments,
    note: data.note,
  };

  await api.put<void>(`Applications/${data.waterConservationApplicationId}`, request);
};

export const getApplication = async (
  context: IMsalContext,
  data: {
    applicationId: string;
    perspective: ApplicationReviewPerspective;
  },
): Promise<{ application: ApplicationDetails; notes?: ApplicationReviewNote[] }> => {
  const api = await westDaatApi(context);

  let request: ApplicationLoadRequestBase;

  switch (data.perspective) {
    case 'applicant': {
      const applicantRequest: ApplicantConservationApplicationLoadRequest = {
        $type: 'ApplicantConservationApplicationLoadRequest',
        applicationId: data.applicationId,
      };
      request = applicantRequest;
      break;
    }
    case 'reviewer': {
      const reviewerRequest: ReviewerConservationApplicationLoadRequest = {
        $type: 'ReviewerConservationApplicationLoadRequest',
        applicationId: data.applicationId,
      };
      request = reviewerRequest;
      break;
    }
  }

  const { data: response } = await api.post<ApplicationLoadResponseBase>('Applications/Load', request);

  switch (data.perspective) {
    case 'applicant': {
      const applicantResponse = response as ApplicantConservationApplicationLoadResponse;
      return { application: applicantResponse.application };
    }
    case 'reviewer': {
      const reviewerResponse = response as ReviewerConservationApplicationLoadResponse;
      return { application: reviewerResponse.application, notes: reviewerResponse.notes };
    }
  }
};
