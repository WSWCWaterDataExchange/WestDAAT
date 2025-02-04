using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Accessors;
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

    private readonly IOrganizationAccessor _organizationAccessor;

    public ValidationEngine(
        IContextUtility contextUtility,
        ISecurityUtility securityUtility,
        IOrganizationAccessor organizationAccessor
    )
    {
        _contextUtility = contextUtility;
        _securityUtility = securityUtility;
        _organizationAccessor = organizationAccessor;
    }

    public async Task<ErrorBase> Validate(RequestBase request)
    {
        var context = _contextUtility.GetContext();

        return request switch
        {
            ApplicationLoadRequestBase req => ValidateApplicationLoadRequest(req, context),
            ApplicationStoreRequestBase req => await ValidateApplicationStoreRequest(req, context),
            OrganizationLoadRequestBase req => ValidateOrganizationLoadRequest(req, context),
            UserLoadRequestBase req => ValidateUserLoadRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateApplicationLoadRequest(ApplicationLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            OrganizationApplicationDashboardLoadRequest req => ValidateOrganizationApplicationDashboardLoadRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateOrganizationApplicationDashboardLoadRequest(OrganizationApplicationDashboardLoadRequest request, ContextBase context)
    {
        // check if user is a global admin first
        var rolePermissions = _securityUtility.Get(new DTO.PermissionsGetRequest
        {
            Context = context
        });

        if (rolePermissions.Contains(Permissions.OrganizationApplicationDashboardLoad))
        {
            return null;
        }

        // if the user isn't a global admin, they can only view their organizations' applications
        if (request.OrganizationIdFilter == null)
        {
            return CreateForbiddenError(request, context);
        }

        var orgPermissions = _securityUtility.Get(new DTO.OrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = request.OrganizationIdFilter.Value,
        });

        if (!orgPermissions.Contains(Permissions.OrganizationApplicationDashboardLoad))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private async Task<ErrorBase> ValidateApplicationStoreRequest(ApplicationStoreRequestBase request,
        ContextBase context)
    {
        return request switch
        {
            EstimateConsumptiveUseRequest req => await ValidateEstimateConsumptiveUseRequest(req, context),
            WaterConservationApplicationCreateRequest req => await ValidateWaterConservationApplicationCreateRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private async Task<ErrorBase> ValidateEstimateConsumptiveUseRequest(EstimateConsumptiveUseRequest request,
        ContextBase context)
    {
        await Task.CompletedTask;
        return null;
    }

    private async Task<ErrorBase> ValidateWaterConservationApplicationCreateRequest(WaterConservationApplicationCreateRequest request, ContextBase context)
    {
        await Task.CompletedTask;
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