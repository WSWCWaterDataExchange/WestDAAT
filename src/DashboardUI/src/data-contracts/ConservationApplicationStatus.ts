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

export const getApplicationStatusIconClass = (status: ConservationApplicationStatus): string => {
  switch (status) {
    case ConservationApplicationStatus.Accepted:
      return 'application-status-icon-approved';
    case ConservationApplicationStatus.Rejected:
      return 'application-status-icon-rejected';
    case ConservationApplicationStatus.InTechnicalReview:
    case ConservationApplicationStatus.InFinalReview:
      return 'application-status-icon-inReview';
    case ConservationApplicationStatus.Unknown:
      return 'application-status-icon-unknown';
  }
};
