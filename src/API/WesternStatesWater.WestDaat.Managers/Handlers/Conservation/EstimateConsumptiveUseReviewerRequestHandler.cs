using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class EstimateConsumptiveUseReviewerRequestHandler : IRequestHandler<EstimateConsumptiveUseReviewerRequest, EstimateConsumptiveUseReviewerResponse>
{
    public EstimateConsumptiveUseReviewerRequestHandler()
    {
    }

    public async Task<EstimateConsumptiveUseReviewerResponse> Handle(EstimateConsumptiveUseReviewerRequest request)
    {

    }
}
