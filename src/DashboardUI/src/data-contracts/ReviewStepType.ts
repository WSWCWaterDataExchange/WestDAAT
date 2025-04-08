export enum ReviewStepType {
  Unknown = 0,
  ApplicantSubmitted = 1,
  Recommendation = 2,
  Approval = 3,
}

export const ReviewStepTypeDisplayNames = {
  [ReviewStepType.Unknown]: 'Unknown',
  [ReviewStepType.ApplicantSubmitted]: 'Applicant',
  [ReviewStepType.Recommendation]: 'Technical Reviewer',
  [ReviewStepType.Approval]: 'Final Reviewer',
};
