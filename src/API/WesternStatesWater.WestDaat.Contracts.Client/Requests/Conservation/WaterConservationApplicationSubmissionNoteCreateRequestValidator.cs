using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmissionNoteCreateRequestValidator : AbstractValidator<WaterConservationApplicationSubmissionNoteCreateRequest>
{
    public WaterConservationApplicationSubmissionNoteCreateRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();
        RuleFor(x => x.Note).NotEmpty().MaximumLength(4000);
    }
}