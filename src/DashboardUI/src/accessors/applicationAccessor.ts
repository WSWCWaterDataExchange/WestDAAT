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
import { ApplicantEstimateConsumptiveUseRequest } from '../data-contracts/EstimateConsumptiveUseApplicantRequest';
import { ApplicantEstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseApplicantResponse';
import { OrganizationApplicationDashboardLoadRequest } from '../data-contracts/OrganizationApplicationDashboardLoadRequest';
import { OrganizationApplicationDashboardLoadResponse } from '../data-contracts/OrganizationApplicationDashboardLoadResponse';
import { ReviewerConservationApplicationLoadRequest } from '../data-contracts/ReviewerConservationApplicationLoadRequest';
import { ReviewerConservationApplicationLoadResponse } from '../data-contracts/ReviewerConservationApplicationLoadResponse';
import { WaterConservationApplicationCreateRequest } from '../data-contracts/WaterConservationApplicationCreateRequest';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';
import { WaterConservationApplicationSubmissionRequest } from '../data-contracts/WaterConservationApplicationSubmissionRequest';
import { WaterConservationApplicationSubmissionUpdateRequest } from '../data-contracts/WaterConservationApplicationSubmissionUpdateRequest';
import { ContainerName, downloadFilesFromBlobStorage, uploadFilesToBlobStorage } from '../utilities/fileUploadHelpers';
import {
  generateDocumentDownloadSasToken,
  generateDocumentUploadSasTokens,
  generateMapImageUploadSasToken,
} from './fileAccessor';
import westDaatApi from './westDaatApi';
import { MapPolygon } from '../data-contracts/MapPolygon';
import { RecommendationDecision } from '../data-contracts/RecommendationDecision';
import { WaterConservationApplicationRecommendationRequest } from '../data-contracts/WaterConservationApplicationRecommendationRequest';
import { WaterConservationApplicationSubmissionUpdateResponse } from '../data-contracts/WaterConservationApplicationSubmissionUpdateResponse';
import { ApprovalDecision } from '../data-contracts/ApprovalDecision';
import { WaterConservationApplicationApprovalRequest } from '../data-contracts/WaterConservationApplicationApprovalRequest';
import { MapPoint } from '../data-contracts/MapPoint';
import { ReviewerEstimateConsumptiveUseResponse } from '../data-contracts/ReviewerEstimateConsumptiveUseResponse';
import { ReviewerEstimateConsumptiveUseRequest } from '../data-contracts/ReviewerEstimateConsumptiveUseRequest';
import { ReviewPipeline } from '../data-contracts/ReviewPipeline';
import { WaterConservationApplicationNoteCreateResponse } from '../data-contracts/WaterConservationApplicationNoteCreateResponse';
import { WaterConservationApplicationNoteCreateRequest } from '../data-contracts/WaterConservationApplicationNoteCreateRequest';

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

export const applicantEstimateConsumptiveUse = async (
  context: IMsalContext,
  fields: {
    waterConservationApplicationId: string;
    waterRightNativeId: string;
    polygons: MapPolygon[];
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
): Promise<ApplicantEstimateConsumptiveUseResponse> => {
  const request: ApplicantEstimateConsumptiveUseRequest = {
    $type: 'ApplicantEstimateConsumptiveUseRequest',
    waterConservationApplicationId: fields.waterConservationApplicationId,
    waterRightNativeId: fields.waterRightNativeId,
    polygons: fields.polygons,
    compensationRateDollars: fields.compensationRateDollars,
    units: fields.units,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<ApplicantEstimateConsumptiveUseResponse>(
    'Applications/EstimateConsumptiveUse',
    request,
  );

  return data;
};

export const reviewerEstimateConsumptiveUse = async (
  context: IMsalContext,
  fields: {
    waterConservationApplicationId: string;
    polygons: MapPolygon[];
    controlLocation: MapPoint;
    updateEstimate: boolean;
  },
): Promise<ReviewerEstimateConsumptiveUseResponse> => {
  const request: ReviewerEstimateConsumptiveUseRequest = {
    $type: 'ReviewerEstimateConsumptiveUseRequest',
    waterConservationApplicationId: fields.waterConservationApplicationId,
    polygons: fields.polygons,
    controlLocation: fields.controlLocation,
    updateEstimate: fields.updateEstimate,
  };

  const api = await westDaatApi(context);
  const { data } = await api.post<ReviewerEstimateConsumptiveUseResponse>(
    'Applications/EstimateConsumptiveUse',
    request,
  );

  return data;
};

export const uploadApplicationDocuments = async (
  context: IMsalContext,
  files: File[],
): Promise<ApplicationDocument[]> => {
  const sasTokens = (await generateDocumentUploadSasTokens(context, files.length)).sasTokens;
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

export const uploadApplicationStaticMap = async (
  context: IMsalContext,
  file: File,
  applicationId: string,
): Promise<void> => {
  const sasToken = (await generateMapImageUploadSasToken(context, applicationId)).sasToken;

  const blobUploads: BlobUpload[] = [
    {
      data: file,
      contentLength: file.size,
      blobname: sasToken.blobname,
      hostname: sasToken.hostname,
      sasToken: sasToken.sasToken,
    },
  ];
  await uploadFilesToBlobStorage(ContainerName.ApplicationMapImages, blobUploads);
};

export const downloadApplicationDocuments = async (context: IMsalContext, documentId: string): Promise<void> => {
  const { sasToken, fileName } = await generateDocumentDownloadSasToken(context, documentId);
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
    $type: 'WaterConservationApplicationSubmissionRequest',
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
): Promise<WaterConservationApplicationSubmissionUpdateResponse> => {
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

  const { data: response } = await api.put<WaterConservationApplicationSubmissionUpdateResponse>(
    `Applications/${data.waterConservationApplicationId}`,
    request,
  );

  return response;
};

export const submitApplicationRecommendation = async (
  context: IMsalContext,
  data: {
    waterConservationApplicationId: string;
    recommendationDecision: RecommendationDecision;
    recommendationNotes?: string;
  },
): Promise<void> => {
  const api = await westDaatApi(context);

  const request: WaterConservationApplicationRecommendationRequest = {
    $type: 'WaterConservationApplicationRecommendationRequest',
    waterConservationApplicationId: data.waterConservationApplicationId,
    recommendationDecision: data.recommendationDecision,
    recommendationNotes: data.recommendationNotes,
  };

  await api.post<void>('Applications/Submit', request);
};

export const submitApplicationApproval = async (
  context: IMsalContext,
  data: {
    waterConservationApplicationId: string;
    approvalDecision: ApprovalDecision;
    approvalNotes: string;
  },
): Promise<void> => {
  const api = await westDaatApi(context);

  const request: WaterConservationApplicationApprovalRequest = {
    $type: 'WaterConservationApplicationApprovalRequest',
    waterConservationApplicationId: data.waterConservationApplicationId,
    approvalDecision: data.approvalDecision,
    approvalNotes: data.approvalNotes,
  };

  await api.post<void>('Applications/Submit', request);
};

export const getApplication = async (
  context: IMsalContext,
  data: {
    applicationId: string;
    perspective: ApplicationReviewPerspective;
  },
): Promise<{ application: ApplicationDetails; notes?: ApplicationReviewNote[]; reviewPipeline?: ReviewPipeline }> => {
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
      return {
        application: reviewerResponse.application,
        notes: reviewerResponse.notes,
        reviewPipeline: reviewerResponse.reviewPipeline,
      };
    }
  }
};

export const createApplicationReviewerNote = async (
  context: IMsalContext,
  data: {
    applicationId: string;
    note: string;
  },
): Promise<WaterConservationApplicationNoteCreateResponse> => {
  const api = await westDaatApi(context);

  const request: WaterConservationApplicationNoteCreateRequest = {
    $type: 'WaterConservationApplicationNoteCreateRequest',
    waterConservationApplicationId: data.applicationId,
    note: data.note,
  };

  const { data: response } = await api.post<WaterConservationApplicationNoteCreateResponse>(
    'Applications/Notes',
    request,
  );

  return response;
};
