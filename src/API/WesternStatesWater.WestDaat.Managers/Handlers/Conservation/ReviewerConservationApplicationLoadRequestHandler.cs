using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ReviewerConservationApplicationLoadRequestHandler : IRequestHandler<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>
{
    public Task<ReviewerConservationApplicationLoadResponse> Handle(ReviewerConservationApplicationLoadRequest request)
    {
        throw new NotImplementedException();
    }
}
