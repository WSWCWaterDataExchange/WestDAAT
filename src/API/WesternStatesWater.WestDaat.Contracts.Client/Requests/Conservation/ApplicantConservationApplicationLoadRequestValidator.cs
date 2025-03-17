using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class ApplicantConservationApplicationLoadRequestValidator : AbstractValidator<ApplicantConservationApplicationLoadRequest>
{
    public ApplicantConservationApplicationLoadRequestValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
    }
}
