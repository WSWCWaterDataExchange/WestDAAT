import { FundingOrganizationDetails } from '../data-contracts/FundingOrganizationDetails';

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
