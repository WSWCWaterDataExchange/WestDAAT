using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface INotificationManager : IServiceContractBase
    {
        void SendFeedback(FeedbackRequest request);
    }
}
