namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : IUsernameFormattingEngine
{
    public async Task<DTO.UsernameFormatResponseBase> Format(DTO.UsernameFormatRequestBase request)
    {
        return request switch
        {
            DTO.UserProfileUsernameFormatRequest req => await FormatUserProfileUsername(req),
            _ => throw new NotImplementedException(),
        };
    }

    private async Task<DTO.UserProfileUsernameFormatResponse> FormatUserProfileUsername(DTO.UserProfileUsernameFormatRequest request)
    {
        // Safety net in case we can't find a
        // unique username don't hammer the database
        var maxRetries = 10;

        for (var i = 0; i <= maxRetries; i++)
        {
            var usernameBase = $"{request.FirstName[0]}{request.LastName}";
            var usernamePostfix = new Random().Next(1000, 9999).ToString();
            var username = $"{usernameBase}{usernamePostfix}";

            var userExistsResponse = (DTO.UsernameExistsResponse)await _userAccessor.Load(new DTO.UsernameExistsRequest
            {
                Username = username
            });

            // Winner
            if (!userExistsResponse.Exists)
            {
                return new DTO.UserProfileUsernameFormatResponse
                {
                    Username = username
                };
            }
        }

        throw new InvalidOperationException($"Unable to produce unique username after {maxRetries} attempts.");
    }
}