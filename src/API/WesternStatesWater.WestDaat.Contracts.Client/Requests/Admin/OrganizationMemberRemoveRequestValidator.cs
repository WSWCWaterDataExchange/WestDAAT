using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationMemberRemoveRequestValidator : AbstractValidator<OrganizationMemberRemoveRequest>
{
    public OrganizationMemberRemoveRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();

        RuleFor(x => x.UserId).NotEmpty();
    }
}