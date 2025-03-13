using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ReviewerConservationApplicationLoadRequestHandler : IRequestHandler<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>
{
    public IApplicationAccessor ApplicationAccessor { get; }

    public ReviewerConservationApplicationLoadRequestHandler(IApplicationAccessor applicationAccessor)
    {
        ApplicationAccessor = applicationAccessor;
    }

    public async Task<ReviewerConservationApplicationLoadResponse> Handle(ReviewerConservationApplicationLoadRequest request)
    {
        var dtoRequest = request.Map<Common.DataContracts.ReviewerConservationApplicationLoadRequest>();
        var dtoResponse = (Common.DataContracts.ReviewerConservationApplicationLoadResponse)await ApplicationAccessor.Load(dtoRequest);

        var response = dtoResponse.Map<ReviewerConservationApplicationLoadResponse>();
        return response;
    }
}
