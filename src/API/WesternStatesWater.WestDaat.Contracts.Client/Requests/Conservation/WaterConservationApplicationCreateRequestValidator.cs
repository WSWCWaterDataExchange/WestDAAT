﻿using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationCreateRequestValidator : AbstractValidator<WaterConservationApplicationCreateRequest>
{
    public WaterConservationApplicationCreateRequestValidator()
    {
        RuleFor(x => x.FundingOrganizationId).NotEmpty();

        RuleFor(x => x.WaterRightNativeId).NotEmpty();
    }
}
