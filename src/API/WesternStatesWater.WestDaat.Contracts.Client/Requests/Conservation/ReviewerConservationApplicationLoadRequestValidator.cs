using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class ReviewerConservationApplicationLoadRequestValidator : AbstractValidator<ReviewerConservationApplicationLoadRequest>
{
    public ReviewerConservationApplicationLoadRequestValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
    }
}