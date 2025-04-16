export enum ApprovalDecision {
  Unknown = 0,
  Approved = 1,
  Denied = 2,
}

export const ApprovalDecisionDisplayNames: { [key in ApprovalDecision]: string } = {
  [ApprovalDecision.Unknown]: 'Unknown',
  [ApprovalDecision.Approved]: 'Approved',
  [ApprovalDecision.Denied]: 'Deny',
};
