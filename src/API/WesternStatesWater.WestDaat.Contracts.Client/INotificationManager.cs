using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface INotificationManager : IServiceContractBase
    {
        Task SendFeedback(FeedbackRequest request);
    }
}
