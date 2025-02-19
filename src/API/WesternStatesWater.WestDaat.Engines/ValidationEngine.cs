using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.Extensions;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Engines;

internal class ValidationEngine : IValidationEngine
{
    private readonly IContextUtility _contextUtility;

    private readonly ISecurityUtility _securityUtility;

    private readonly IOrganizationAccessor _organizationAccessor;

    private readonly IApplicationAccessor _applicationAccessor;

    public ValidationEngine(
        IContextUtility contextUtility,
        ISecurityUtility securityUtility,
        IOrganizationAccessor organizationAccessor,
        IApplicationAccessor applicationAccessor
    )
    {
        _contextUtility = contextUtility;
        _securityUtility = securityUtility;
        _organizationAccessor = organizationAccessor;
        _applicationAccessor = applicationAccessor;
    }

    public async Task<ErrorBase> Validate(RequestBase request)
    {
        var context = _contextUtility.GetContext();

        return request switch
        {
            ApplicationLoadRequestBase req => ValidateApplicationLoadRequest(req, context),
            ApplicationStoreRequestBase req => await ValidateApplicationStoreRequest(req, context),
            OrganizationLoadRequestBase req => ValidateOrganizationLoadRequest(req, context),
            OrganizationStoreRequestBase req => await ValidateOrganizationStoreRequest(req, context),
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
        // verify user requesting an estimate is linking it to an application they own
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var inProgressApplicationExistsResponse = (DTO.UnsubmittedApplicationExistsLoadResponse)await _applicationAccessor.Load(new DTO.UnsubmittedApplicationExistsLoadRequest
        {
            ApplicantUserId = userContext.UserId,
            WaterRightNativeId = request.WaterRightNativeId
        });

        var applicationNotFound = !inProgressApplicationExistsResponse.InProgressApplicationId.HasValue;
        if (applicationNotFound)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id {request.WaterConservationApplicationId}");
        }

        // user has an in-progress application for the requested water right
        // BUT user is attempting to link the estimate to a different application
        var estimateLinkedToIncorrectApplication = inProgressApplicationExistsResponse.InProgressApplicationId.Value != request.WaterConservationApplicationId;
        if (estimateLinkedToIncorrectApplication)
        {
            return CreateForbiddenError(request, context);
        }

        // user has an in-progress application for the requested water right
        // BUT user is attempting to request an estimate using an organization that may not control this water right
        var estimateRequestedOfIncorrectOrganization = inProgressApplicationExistsResponse.FundingOrganizationId.HasValue &&
                                                       inProgressApplicationExistsResponse.FundingOrganizationId.Value != request.FundingOrganizationId;
        if (estimateRequestedOfIncorrectOrganization)
        {
            return CreateForbiddenError(request, context);
        }

        var polygonGeometries = request.Polygons.Select(GeometryHelpers.GetGeometryByWkt).ToArray();

        for (int i = 0; i < polygonGeometries.Length; i++)
        {
            for (int j = i + 1; j < polygonGeometries.Length; j++)
            {
                if (polygonGeometries[i].Intersects(polygonGeometries[j]))
                {
                    return CreateValidationError(request, nameof(EstimateConsumptiveUseRequest.Polygons), "Polygons must not intersect.");
                }
            }
        }

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
            OrganizationDetailsListRequest req => ValidateOrganizationDetailsListRequest(req, context),
            OrganizationSummaryListRequest req => ValidateOrganizationSummaryListRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private ErrorBase ValidateOrganizationDetailsListRequest(OrganizationDetailsListRequest request, ContextBase context)
    {
        var permissionsRequest = new DTO.PermissionsGetRequest()
        {
            Context = context
        };

        var permissions = _securityUtility.Get(permissionsRequest);

        if (!permissions.Contains(Permissions.OrganizationDetailsList))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private ErrorBase ValidateOrganizationSummaryListRequest(OrganizationSummaryListRequest request, ContextBase context)
    {
        // Must be logged in
        _contextUtility.GetRequiredContext<UserContext>();

        return null;
    }

    private async Task<ErrorBase> ValidateOrganizationStoreRequest(OrganizationStoreRequestBase request, ContextBase context)
    {
        return request switch
        {
            OrganizationMemberAddRequest req => await ValidateOrganizationMemberAddRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private async Task<ErrorBase> ValidateOrganizationMemberAddRequest(OrganizationMemberAddRequest request, ContextBase context)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        // Cannot add yourself to an organization since a user can only be in a single organization.
        if (request.UserId == userContext.UserId)
        {
            return CreateForbiddenError(request, context);
        }

        var permissions = _securityUtility.Get(new DTO.PermissionsGetRequest { Context = context });
        var orgPermissions = _securityUtility.Get(new DTO.OrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = request.OrganizationId
        });


        if (!permissions.Contains(Permissions.OrganizationMemberAdd) &&
            !orgPermissions.Contains(Permissions.OrganizationMemberAdd))
        {
            return CreateForbiddenError(request, context);
        }

        // Verify the user is not already in an organization
        var userOrganizationResponse = (DTO.UserOrganizationLoadResponse)await _organizationAccessor.Load(new DTO.UserOrganizationLoadRequest
        {
            UserId = request.UserId
        });

        if (userOrganizationResponse.Organizations.Any())
        {
            return CreateConflictError(request, context, nameof(UserOrganization), request.UserId, request.OrganizationId);
        }

        return null;
    }

    private ErrorBase ValidateUserLoadRequest(UserLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            EnrichJwtRequest => ValidateEnrichJwtRequest(context),
            UserSearchRequest => ValidateUserSearchRequest(context),
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

    private ErrorBase ValidateUserSearchRequest(ContextBase context)
    {
        var permissions = _securityUtility.Get(new DTO.PermissionsGetRequest { Context = context });

        var orgPermissions = _securityUtility.Get(new DTO.OrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = null // Any organization
        });

        if (!permissions.Contains(Permissions.UserSearch) &&
            !orgPermissions.Contains(Permissions.UserSearch))
        {
            return CreateForbiddenError(new UserSearchRequest(), context);
        }

        return null;
    }

    private ConflictError CreateConflictError(
        RequestBase request,
        ContextBase context,
        string resourceName,
        params Guid[] resourceIds
    )
    {
        var logMessage =
            $"'{context.ToLogString()}' attempted to make a request of type '{request.GetType().Name}', " +
            $"but the resource '{resourceName}' with ID(s) '{string.Join(", ", resourceIds)}' already exists.";

        return new ConflictError { LogMessage = logMessage };
    }

    private ValidationError CreateValidationError(
        RequestBase request,
        string fieldName,
        string errorMessage
    )
    {
        var errors = new Dictionary<string, string[]> { { fieldName, new[] { errorMessage } } };
        var logMessage =
            $"'{request.GetType().Name}' failed validation on the fields {fieldName}";

        return new ValidationError(errors) { LogMessage = logMessage };
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