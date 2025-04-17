export enum RecommendationDecision {
  Unknown = 0,
  For = 1,
  Against = 2,
}

export const RecommendationDecisionDisplayNames: { [key in RecommendationDecision]: string } = {
  [RecommendationDecision.Unknown]: 'Unknown',
  [RecommendationDecision.For]: 'Recommend',
  [RecommendationDecision.Against]: 'Do Not Recommend',
};
