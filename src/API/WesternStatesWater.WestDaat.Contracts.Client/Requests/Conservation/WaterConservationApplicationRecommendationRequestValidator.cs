using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationRecommendationRequestValidator : AbstractValidator<WaterConservationApplicationRecommendationRequest>
{
    public WaterConservationApplicationRecommendationRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();
        
        RuleFor(x => x.IsRecommended).NotEmpty();
        
        RuleFor(x => x.RecommendationNotes).MaximumLength(4000);
    }
}