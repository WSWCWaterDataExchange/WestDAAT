using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmissionRequestValidator : AbstractValidator<WaterConservationApplicationSubmissionRequest>
{
    public WaterConservationApplicationSubmissionRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.WaterRightNativeId).NotEmpty();

        RuleFor(x => x.AgentFirstName).NotEmpty().MaximumLength(100);

        RuleFor(x => x.AgentLastName).NotEmpty().MaximumLength(100);

        RuleFor(x => x.AgentEmail).NotEmpty().MaximumLength(255);

        RuleFor(x => x.AgentPhoneNumber).NotEmpty().MaximumLength(50);

        RuleFor(x => x.LandownerFirstName).NotEmpty().MaximumLength(100);

        RuleFor(x => x.LandownerLastName).NotEmpty().MaximumLength(100);

        RuleFor(x => x.LandownerEmail).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LandownerPhoneNumber).NotEmpty().MaximumLength(50);

        RuleFor(x => x.LandownerAddress).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LandownerCity).NotEmpty().MaximumLength(100);

        RuleFor(x => x.LandownerState).NotEmpty().MaximumLength(2);

        RuleFor(x => x.LandownerZipCode).NotEmpty().MaximumLength(10);

        RuleFor(x => x.CanalOrIrrigationEntityName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.CanalOrIrrigationEntityEmail).NotEmpty().MaximumLength(255);

        RuleFor(x => x.CanalOrIrrigationEntityPhoneNumber).NotEmpty().MaximumLength(50);

        RuleFor(x => x.ConservationPlanFundingRequestDollarAmount).NotEmpty();

        RuleFor(x => x.ConservationPlanFundingRequestCompensationRateUnits).NotEmpty();

        RuleFor(x => x.ConservationPlanDescription).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.ConservationPlanAdditionalInfo).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.EstimationSupplementaryDetails).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.ProjectLocation).NotEmpty().MaximumLength(255);

        RuleFor(x => x.PropertyAdditionalDetails).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.DiversionPoint).NotEmpty().MaximumLength(255);

        RuleFor(x => x.DiversionPointDetails).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.PermitNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.FacilityDitchName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.PriorityDate).NotEmpty();

        RuleFor(x => x.CertificateNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.ShareNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.WaterRightState).NotEmpty().Length(2);

        RuleFor(x => x.WaterUseDescription).NotEmpty().MaximumLength(4000);
    }
}
