using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationDocumentUploadSasTokenRequestValidator : AbstractValidator<ApplicationDocumentUploadSasTokenRequest>
{
    public ApplicationDocumentUploadSasTokenRequestValidator()
    {
        RuleFor(x => x.FileUploadCount).GreaterThan(0);
    }
}