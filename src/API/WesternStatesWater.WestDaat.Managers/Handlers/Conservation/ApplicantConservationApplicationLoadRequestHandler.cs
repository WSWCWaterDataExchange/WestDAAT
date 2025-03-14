using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ApplicantConservationApplicationLoadRequestHandler : IRequestHandler<ApplicantConservationApplicationLoadRequest, ApplicantConservationApplicationLoadResponse>
{
    public IApplicationAccessor ApplicationAccessor { get; }

    public ApplicantConservationApplicationLoadRequestHandler(IApplicationAccessor applicationAccessor)
    {
        ApplicationAccessor = applicationAccessor;
    }

    public async Task<ApplicantConservationApplicationLoadResponse> Handle(ApplicantConservationApplicationLoadRequest request)
    {
        var dtoRequest = request.Map<Common.DataContracts.ApplicationLoadSingleRequest>();
        var dtoResponse = (Common.DataContracts.ApplicationLoadSingleResponse)await ApplicationAccessor.Load(dtoRequest);

        // applicants cannot view notes
        dtoResponse.Application.Notes = null;

        var response = dtoResponse.Map<ApplicantConservationApplicationLoadResponse>();
        return response;
    }
}
