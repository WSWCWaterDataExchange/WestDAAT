export enum ConservationApplicationStatus {
  Unknown = 0,
  InReview = 1,
  Approved = 2,
  Rejected = 3,
}

export const ConservationApplicationStatusDisplayNames: { [key in ConservationApplicationStatus]: string } = {
  [ConservationApplicationStatus.Unknown]: 'Unknown',
  [ConservationApplicationStatus.InReview]: 'In Review',
  [ConservationApplicationStatus.Approved]: 'Approved',
  [ConservationApplicationStatus.Rejected]: 'Rejected'
}
