using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationFundingDetailsRequestValidator : AbstractValidator<OrganizationFundingDetailsRequest>
{
    public OrganizationFundingDetailsRequestValidator()
    {
        RuleFor(x => x.WaterRightNativeId).NotEmpty();
    }
}
