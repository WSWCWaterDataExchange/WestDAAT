using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserListRequestValidator : AbstractValidator<UserListRequest>
{
    public UserListRequestValidator()
    {
    }
}