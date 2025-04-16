using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationApprovedEventValidator : AbstractValidator<WaterConservationApplicationApprovedEvent>
{
    public WaterConservationApplicationApprovedEventValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
    }
}