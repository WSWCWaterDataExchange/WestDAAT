using FluentValidation;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationMemberUpdateRequestValidator : AbstractValidator<OrganizationMemberUpdateRequest>
{
    public OrganizationMemberUpdateRequestValidator()
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