using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationMapImageUploadSasTokenRequestValidator : AbstractValidator<ApplicationMapImageUploadSasTokenRequest>
{
    public ApplicationMapImageUploadSasTokenRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();
    }
}