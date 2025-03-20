using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmissionUpdateRequestValidator : AbstractValidator<WaterConservationApplicationSubmissionUpdateRequest>
{
    public WaterConservationApplicationSubmissionUpdateRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.WaterRightNativeId).NotEmpty();

        RuleFor(x => x.AgentName).MaximumLength(255);

        RuleFor(x => x.AgentEmail).MaximumLength(255);

        RuleFor(x => x.AgentPhoneNumber).MaximumLength(50);

        RuleFor(x => x.AgentAdditionalDetails).MaximumLength(4000);

        RuleFor(x => x.LandownerName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LandownerEmail).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LandownerPhoneNumber).NotEmpty().MaximumLength(50);

        RuleFor(x => x.LandownerAddress).NotEmpty().MaximumLength(255);

        RuleFor(x => x.LandownerCity).NotEmpty().MaximumLength(100);

        RuleFor(x => x.LandownerState).NotEmpty().MaximumLength(2);

        RuleFor(x => x.LandownerZipCode).NotEmpty().MaximumLength(10);

        RuleFor(x => x.CanalOrIrrigationEntityName).MaximumLength(255);

        RuleFor(x => x.CanalOrIrrigationEntityEmail).MaximumLength(255);

        RuleFor(x => x.CanalOrIrrigationEntityPhoneNumber).MaximumLength(50);

        RuleFor(x => x.CanalOrIrrigationAdditionalDetails).MaximumLength(4000);

        RuleFor(x => x.ConservationPlanFundingRequestDollarAmount).NotEmpty();

        RuleFor(x => x.ConservationPlanFundingRequestCompensationRateUnits).NotEmpty();

        RuleFor(x => x.ConservationPlanDescription).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.ConservationPlanAdditionalInfo).MaximumLength(4000);

        RuleFor(x => x.EstimationSupplementaryDetails).MaximumLength(4000);

        RuleFor(x => x.PermitNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.FacilityDitchName).NotEmpty().MaximumLength(255);

        RuleFor(x => x.PriorityDate).NotEmpty();

        RuleFor(x => x.CertificateNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.ShareNumber).NotEmpty().MaximumLength(255);

        RuleFor(x => x.WaterRightState).NotEmpty().Length(2);

        RuleFor(x => x.WaterUseDescription).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.Note).NotEmpty().MaximumLength(4000);

        RuleFor(x => x.FieldDetails).NotNull().ForEach(item => item.ChildRules(detailValidator =>
        {
            detailValidator.RuleFor(detail => detail.WaterConservationApplicationEstimateLocationId).NotEmpty();
            detailValidator.RuleFor(detail => detail.AdditionalDetails).NotEmpty().MaximumLength(4000);
        }));
    }
}
