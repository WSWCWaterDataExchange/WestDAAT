using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IEmailNotificationSdk
    {
        Task SendEmail(CommonDTO.EmailRequest message);
    }
}
