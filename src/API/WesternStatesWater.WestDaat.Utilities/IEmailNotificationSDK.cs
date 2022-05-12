using SendGrid;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IEmailNotificationSDK
    {
        Task SendEmail(CommonDTO.EmailRequest message);
    }
}
