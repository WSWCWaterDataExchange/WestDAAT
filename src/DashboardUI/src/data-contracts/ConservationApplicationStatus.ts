export enum ConservationApplicationStatus {
  Unknown = 0,
  InReview = 1,
  Approved = 2,
  Rejected = 3
}

export function formatConservationApplicationStatusText(status: ConservationApplicationStatus): string {
  switch (status) {
    case ConservationApplicationStatus.InReview:
      return 'In Review';
    case ConservationApplicationStatus.Approved:
      return 'Approved';
    case ConservationApplicationStatus.Rejected:
      return 'Rejected';
    case ConservationApplicationStatus.Unknown:
    default:
      return 'Unknown';
  }
}