using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationApprovalRequestValidator : AbstractValidator<WaterConservationApplicationApprovalRequest>
{
    public WaterConservationApplicationApprovalRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.ApprovalDecision).NotEmpty();
        
        RuleFor(x => x.ApprovalNotes).NotEmpty().MaximumLength(4000);
    }
}