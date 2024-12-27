using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;

namespace WesternStatesWater.WestDaat.Engines;

internal class ValidationEngine : IValidationEngine
{
    public Task<ErrorBase> Validate<TRequest>(TRequest request) where TRequest : RequestBase
    {
        return Task.FromResult(default(ErrorBase));
    }
}