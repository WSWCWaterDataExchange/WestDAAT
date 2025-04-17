export enum ConservationApplicationStatus {
  Unknown = 0,
  InTechnicalReview = 1,
  InFinalReview = 2,
  Approved = 3,
  Denied = 4,
}

export const ConservationApplicationStatusDisplayNames: { [key in ConservationApplicationStatus]: string } = {
  [ConservationApplicationStatus.Unknown]: 'Unknown',
  [ConservationApplicationStatus.InTechnicalReview]: 'In Technical Review',
  [ConservationApplicationStatus.InFinalReview]: 'In Final Review',
  [ConservationApplicationStatus.Approved]: 'Approved',
  [ConservationApplicationStatus.Denied]: 'Denied',
};

export const getApplicationStatusIconClass = (status: ConservationApplicationStatus): string => {
  switch (status) {
    case ConservationApplicationStatus.Approved:
      return 'application-status-icon-approved';
    case ConservationApplicationStatus.Denied:
      return 'application-status-icon-denied';
    case ConservationApplicationStatus.InTechnicalReview:
    case ConservationApplicationStatus.InFinalReview:
      return 'application-status-icon-inReview';
    case ConservationApplicationStatus.Unknown:
      return 'application-status-icon-unknown';
  }
};
