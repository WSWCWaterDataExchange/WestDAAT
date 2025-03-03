using FluentValidation;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationMemberAddRequestValidator : AbstractValidator<OrganizationMemberAddRequest>
{
    public OrganizationMemberAddRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();

        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.Role)
            .Must(role =>
            {
                string[] allowedRoles = [Roles.Member, Roles.OrganizationAdmin, Roles.TechnicalReviewer];
                return allowedRoles.Contains(role);
            })
            .WithMessage("Role not allowed.");
    }
}

public class UserProfileUpdateRequestValidator : AbstractValidator<UserProfileUpdateRequest>
{
    public UserProfileUpdateRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LastName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.State).NotEmpty().MaximumLength(2);

        RuleFor(x => x.Country).NotEmpty().MaximumLength(50);

        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(50);
    }
}