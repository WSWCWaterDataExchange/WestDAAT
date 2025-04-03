import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { RecommendationDecision } from './RecommendationDecision';

export interface WaterConservationApplicationRecommendationRequest extends ApplicationStoreRequestBase {
  $type: 'WaterConservationApplicationRecommendationRequest';
  waterConservationApplicationId: string;
  recommendationDecision: RecommendationDecision;
  recommendationNotes?: string;
}
