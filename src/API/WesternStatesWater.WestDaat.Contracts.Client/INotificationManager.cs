using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface INotificationManager : IServiceContractBase
    {
        Task<bool> PostFeedback(FeedbackRequest request);
    }
}
