using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationUserListRequestValidator : AbstractValidator<OrganizationUserListRequest>
{
    public OrganizationUserListRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();
    }
}