using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : IUserNameFormattingEngine
{
    public async Task<DTO.UserNameFormatResponseBase> Format(DTO.UserNameFormatRequestBase request)
    {
        return request switch
        {
            DTO.UserProfileUserNameFormatRequest req => await FormatUserProfileUserName(req),
            _ => throw new NotImplementedException(),
        };
    }

    private async Task<DTO.UserProfileUserNameFormatResponse> FormatUserProfileUserName(DTO.UserProfileUserNameFormatRequest request)
    {
        // Safety net in case we can't find a
        // unique username don't hammer the database indefinitely
        const int maxRetries = 10;

        for (var i = 0; i < maxRetries; i++)
        {
            var usernameBase = $"{request.FirstName[0]}{request.LastName}";
            var usernamePostfix = new Random().Next(1000, 9999).ToString();
            var username = $"{usernameBase}{usernamePostfix}";

            var userExistsResponse = (DTO.UserNameExistsResponse)await _userAccessor.Load(new DTO.UserNameExistsRequest
            {
                UserName = username
            });

            // Winner
            if (!userExistsResponse.Exists)
            {
                return new DTO.UserProfileUserNameFormatResponse
                {
                    UserName = username
                };
            }
        }

        throw new WestDaatException($"Unable to produce unique username after {maxRetries} attempts.");
    }
}