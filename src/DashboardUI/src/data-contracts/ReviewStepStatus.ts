export enum ReviewStepStatus {
  Unknown = 0,
  Submitted = 1,
  RecommendedForApproval = 2,
  RecommendedAgainstApproval = 3,
  Approved = 4,
  Denied = 5,
}

export const getApplicationReviewStepIconClass = (status: ReviewStepStatus): string => {
  switch (status) {
    case ReviewStepStatus.RecommendedForApproval:
    case ReviewStepStatus.Approved:
      return 'application-status-icon-approved';
    case ReviewStepStatus.RecommendedAgainstApproval:
    case ReviewStepStatus.Denied:
      return 'application-status-icon-denied';
    case ReviewStepStatus.Submitted:
      return 'application-status-icon-submitted';
    case ReviewStepStatus.Unknown:
      return 'application-status-icon-unknown';
  }
};

export const ReviewStepStatusDisplayNames: { [key in ReviewStepStatus]: string } = {
  [ReviewStepStatus.Unknown]: 'Unknown',
  [ReviewStepStatus.Submitted]: 'Submitted',
  [ReviewStepStatus.RecommendedForApproval]: 'Recommended For Approval',
  [ReviewStepStatus.RecommendedAgainstApproval]: 'Recommended Against Approval',
  [ReviewStepStatus.Approved]: 'Approved',
  [ReviewStepStatus.Denied]: 'Denied',
};
