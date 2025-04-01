import { ApplicationDetails } from '../data-contracts/ApplicationDetails';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { DrawToolType } from '../data-contracts/DrawToolType';

export const applicationDetailsMock = (): ApplicationDetails => ({
  id: 'application-guid',
  applicantUserId: 'applicant-guid',
  fundingOrganizationId: 'funding-organization-guid',
  waterRightNativeId: 'water-right-native-id',
  applicationDisplayId: '2025-ABCD-001',
  estimate: {
    id: 'estimate-guid',
    compensationRateDollars: 100,
    compensationRateUnits: CompensationRateUnits.AcreFeet,
    estimatedCompensationDollars: 200,
    averageYearlyTotalEtInAcreFeet: 300,
    locations: [
      {
        id: 'location-guid',
        polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
        drawToolType: DrawToolType.Rectangle,
        polygonAreaInAcres: 1,
        additionalDetails: 'I, the user, have some things to say about this field.',
        consumptiveUses: [
          {
            id: 'consumptive-use-guid',
            year: 2025,
            totalEtInInches: 400,
            effectivePrecipitationInInches: null,
            netEtInInches: null,
          },
        ],
      },
    ],
  },
  submission: {
    id: 'submission-guid',
    submittedDate: '2025-01-01T00:00:00.0000000 +00:00',
    acceptedDate: null,
    rejectedDate: null,

    agentName: 'Agent Name',
    agentEmail: 'agent@email',
    agentPhoneNumber: '555-555-5555',
    agentAdditionalDetails: 'Agent additional details',

    landownerName: 'Bobby Hill',
    landownerEmail: 'landowner@email',
    landownerPhoneNumber: '555-555-5555',
    landownerAddress: '123 Main St',
    landownerCity: 'Anytown',
    landownerState: 'NE',
    landownerZipCode: '12345',

    canalOrIrrigationEntityName: 'Canal Entity Name',
    canalOrIrrigationEntityEmail: 'canal@email',
    canalOrIrrigationEntityPhoneNumber: '555-555-5555',
    canalOrIrrigationAdditionalDetails: 'Canal additional details',

    conservationPlanFundingRequestDollarAmount: 1000,
    conservationPlanFundingRequestCompensationRateUnits: CompensationRateUnits.AcreFeet,
    conservationPlanDescription: 'Conservation plan description',
    conservationPlanAdditionalInfo: 'Conservation plan additional info',
    estimationSupplementaryDetails: 'Estimation supplementary details',

    permitNumber: 'Permit Number',
    facilityDitchName: 'Facility Ditch Name',
    priorityDate: '2025-01-01T00:00:00.0000000 +00:00',
    certificateNumber: 'Certificate Number',
    shareNumber: 'Share Number',
    waterRightState: 'NE',
    waterUseDescription: 'Water use description',
  },
  supportingDocuments: [
    {
      id: 'document-guid',
      blobName: 'blobname',
      fileName: 'filename.pdf',
      description: 'Document description',
    },
  ],
});
