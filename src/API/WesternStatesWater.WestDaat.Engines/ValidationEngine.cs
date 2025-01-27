using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.Extensions;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
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

    public async Task<ErrorBase> Validate(RequestBase request)
    {
        var context = _contextUtility.GetContext();

        return request switch
        {
            ApplicationStoreRequestBase req => await ValidateApplicationStoreRequest(req, context),
            OrganizationLoadRequestBase req => ValidateOrganizationLoadRequest(req, context),
            UserLoadRequestBase req => ValidateUserLoadRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private async Task<ErrorBase> ValidateApplicationStoreRequest(ApplicationStoreRequestBase request,
        ContextBase context)
    {
        var permissions = _securityUtility.Get(new DTO.OrganizationPermissionsGetRequest()
        {
            Context = context
        });
        if (!permissions.Contains(Permissions.ConservationApplicationStore))
        {
            return CreateForbiddenError(request, context);
        }

        // If the resources required to fulfill the request are not accessible to the user, or they do not exist.
        var application = await Task.FromResult(1);
        if (application is 2)
        {
            return CreateNotFoundError(
                context,
                "Conservation Application",
                Guid.NewGuid()
            );
        }

        // If there is additional business logic validation that the request doesn't pass.
        if (permissions.Length == 3)
        {
            return new ValidationError(new Dictionary<string, string[]>
            {
                { "Notes", ["You must cross the T's and dot the lowercase J's."] }
            });
        }

        return null;
    }

    private ErrorBase ValidateOrganizationLoadRequest(OrganizationLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            OrganizationLoadAllRequest req => ValidateOrganizationLoadAllRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private ErrorBase ValidateOrganizationLoadAllRequest(OrganizationLoadAllRequest request, ContextBase context)
    {
        var permissionsRequest = new DTO.PermissionsGetRequest()
        {
            Context = context
        };
        
        var permissions = _securityUtility.Get(permissionsRequest);
        
        if (!permissions.Contains(Permissions.OrganizationLoadAll))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private ErrorBase ValidateUserLoadRequest(UserLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            EnrichJwtRequest => ValidateEnrichJwtRequest(context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateEnrichJwtRequest(ContextBase context)
    {
        if (context is not IdentityProviderContext)
        {
            return CreateForbiddenError(new EnrichJwtRequest(), context);
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