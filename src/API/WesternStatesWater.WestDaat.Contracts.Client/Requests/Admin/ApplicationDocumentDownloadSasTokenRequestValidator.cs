using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationDocumentDownloadSasTokenRequestValidator : AbstractValidator<ApplicationDocumentDownloadSasTokenRequest>
{
    public ApplicationDocumentDownloadSasTokenRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationDocumentId).NotEmpty();
    }
}