using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmittedEventValidator : AbstractValidator<WaterConservationApplicationSubmittedEvent>
{
    public WaterConservationApplicationSubmittedEventValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
    }
}