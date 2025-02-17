using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserSearchRequestValidator : AbstractValidator<UserSearchRequest>
{
    public UserSearchRequestValidator()
    {
        RuleFor(x => x.SearchTerm)
            .NotNull()
            .MinimumLength(3)
            .MaximumLength(100);
    }
}