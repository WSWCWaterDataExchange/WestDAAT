using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class EnrichJwtRequestValidator : AbstractValidator<EnrichJwtRequest>
{
    public EnrichJwtRequestValidator()
    {
        RuleFor(x => x.ObjectId).NotEmpty();

        RuleFor(x => x.Email).NotEmpty().EmailAddress(mode: FluentValidation.Validators.EmailValidationMode.AspNetCoreCompatible);
    }
}