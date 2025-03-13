using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ApplicantConservationApplicationLoadRequestHandler : IRequestHandler<ApplicantConservationApplicationLoadRequest, ApplicantConservationApplicationLoadResponse>
{
    public Task<ApplicantConservationApplicationLoadResponse> Handle(ApplicantConservationApplicationLoadRequest request)
    {
        throw new NotImplementedException();
    }
}
