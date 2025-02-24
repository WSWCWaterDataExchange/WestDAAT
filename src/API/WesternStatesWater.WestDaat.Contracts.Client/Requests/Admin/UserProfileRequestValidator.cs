using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserProfileRequestValidator : AbstractValidator<UserProfileRequest>
{
    public UserProfileRequestValidator()
    {
    }
}