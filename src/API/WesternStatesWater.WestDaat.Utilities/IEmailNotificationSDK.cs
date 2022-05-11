using SendGrid;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IEmailNotificationSDK
    {
        Task<Response> SendEmail(CommonDTO.EmailRequest message);
    }
}
