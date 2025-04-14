using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationNoteCreateRequestValidator : AbstractValidator<WaterConservationApplicationNoteCreateRequest>
{
    public WaterConservationApplicationNoteCreateRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.Note).NotEmpty().MaximumLength(4000);
    }
}