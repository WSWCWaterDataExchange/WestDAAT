using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.Extensions;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Engines;

internal class ValidationEngine : IValidationEngine
{
    private readonly IContextUtility _contextUtility;

    private readonly ISecurityUtility _securityUtility;

    public ValidationEngine(
        IContextUtility contextUtility,
        ISecurityUtility securityUtility
    )
    {
        _contextUtility = contextUtility;
        _securityUtility = securityUtility;
    }

    public async Task<ErrorBase> Validate<TRequest>(TRequest request) where TRequest : RequestBase
    {
        var context = _contextUtility.GetContext();
        var permissions = await _securityUtility.GetPermissions(context);

        return request switch
        {
            ApplicationStoreRequestBase req => ValidateUserLoadRequest(req, context, permissions),

            _ => throw new NotImplementedException($"Validation for {request.GetType().Name} is not implemented.")
        };
    }

    private ErrorBase ValidateUserLoadRequest(ApplicationStoreRequestBase request, ContextBase context,
        object permissions)
    {
        // If context cannot make a request of this type.
        if (permissions is 1)
        {
            return CreateForbiddenError(request, context);
        }

        // If the resources required to fulfill the request are not accessible to the user, or they
        // do not exist.
        if (permissions is 2)
        {
            return CreateNotFoundError(
                context,
                "Conservation Application",
                Guid.NewGuid()
            );
        }

        // If there is additional business logic validation that the request doesn't pass.
        if (permissions is 3)
        {
            return new ValidationError(new Dictionary<string, string[]>
            {
                { "Notes", ["You must cross the T's and dot the lowercase J's."] }
            });
        }

        return null;
    }

    private ForbiddenError CreateForbiddenError(
        RequestBase request,
        ContextBase context
    )
    {
        var logMessage =
            $"'{context.ToLogString()}' attempted to make a request of type '{request.GetType().Name}', " +
            $"but did not have permission to do so.";

        return new ForbiddenError { LogMessage = logMessage };
    }

    private NotFoundError CreateNotFoundError(
        ContextBase context,
        string resourceName
    )
    {
        var logMessage =
            $"{context.ToLogString()} attempted to access the resource '{resourceName}', " +
            $"but the resource was not found.";

        var publicMessage =
            $"The requested resource '{resourceName}' was not found, or you do " +
            $"not have permission to access it.";

        return new NotFoundError { LogMessage = logMessage, PublicMessage = publicMessage };
    }

    private NotFoundError CreateNotFoundError(
        ContextBase context,
        string resourceName,
        params Guid[] resourceIds
    )
    {
        var logMessage =
            $"'{context.ToLogString()}' attempted to access the resource '{resourceName}' with ID(s) " +
            $"'{string.Join(", ", resourceIds)}', but the resource was not found.";

        var publicMessage =
            $"The requested resource '{resourceName}' with ID(s) '{string.Join(", ", resourceIds)}' " +
            $"was not found, or you do not have permission to access it.";

        return new NotFoundError { LogMessage = logMessage, PublicMessage = publicMessage };
    }
}