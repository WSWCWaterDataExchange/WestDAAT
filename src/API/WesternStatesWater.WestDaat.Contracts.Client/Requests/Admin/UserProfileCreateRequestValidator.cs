using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserProfileCreateRequestValidator : AbstractValidator<UserProfileCreateRequest>
{
    public UserProfileCreateRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LastName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.State).NotEmpty().MaximumLength(2);

        RuleFor(x => x.Country).NotEmpty().MaximumLength(50);

        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(50);

        RuleFor(x => x.AffiliatedOrganization).MaximumLength(100);
    }
}