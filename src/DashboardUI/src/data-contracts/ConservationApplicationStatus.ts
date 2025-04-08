export enum ConservationApplicationStatus {
  Unknown = 0,
  InTechnicalReview = 1,
  InFinalReview = 2,
  Accepted = 3,
  Rejected = 4,
}

export const ConservationApplicationStatusDisplayNames: { [key in ConservationApplicationStatus]: string } = {
  [ConservationApplicationStatus.Unknown]: 'Unknown',
  [ConservationApplicationStatus.InTechnicalReview]: 'In Technical Review',
  [ConservationApplicationStatus.InFinalReview]: 'In Final Review',
  [ConservationApplicationStatus.Accepted]: 'Approved',
  [ConservationApplicationStatus.Rejected]: 'Rejected',
};
