using SendGrid;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IEmailNotificationSDK
    {
        void SendFeedback(CommonDTO.EmailRequest message);
    }
}
