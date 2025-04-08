export enum ApprovalDecision {
  Unknown = 0,
  Accepted = 1,
  Rejected = 2,
}

export const ApprovalDecisionDisplayNames: { [key in ApprovalDecision]: string } = {
  [ApprovalDecision.Unknown]: 'Unknown',
  [ApprovalDecision.Accepted]: 'Accept',
  [ApprovalDecision.Rejected]: 'Deny',
};
