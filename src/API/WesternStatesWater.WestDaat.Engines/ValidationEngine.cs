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
    
    private readonly IUserAccessor _userAccessor;

    public ValidationEngine(
        IContextUtility contextUtility,
        ISecurityUtility securityUtility,
        IOrganizationAccessor organizationAccessor,
        IApplicationAccessor applicationAccessor,
        IUserAccessor userAccessor
    )
    {
        _contextUtility = contextUtility;
        _securityUtility = securityUtility;
        _organizationAccessor = organizationAccessor;
        _applicationAccessor = applicationAccessor;
        _userAccessor = userAccessor;
    }

    public async Task<ErrorBase> Validate(RequestBase request)
    {
        var context = _contextUtility.GetContext();

        return request switch
        {
            ApplicationLoadRequestBase req => await ValidateApplicationLoadRequest(req, context),
            ApplicationStoreRequestBase req => await ValidateApplicationStoreRequest(req, context),
            EventBase req => ValidateEvent(req, context),
            FileSasTokenRequestBase req => await ValidateFileSasTokenRequest(req, context),
            OrganizationLoadRequestBase req => ValidateOrganizationLoadRequest(req, context),
            OrganizationStoreRequestBase req => await ValidateOrganizationStoreRequest(req, context),
            UserLoadRequestBase req => ValidateUserLoadRequest(req, context),
            UserStoreRequestBase req => ValidateUserStoreRequest(req),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private async Task<ErrorBase> ValidateApplicationLoadRequest(ApplicationLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            OrganizationApplicationDashboardLoadRequest req => ValidateOrganizationApplicationDashboardLoadRequest(req, context),
            ApplicantConservationApplicationLoadRequest req => await ValidateApplicantConservationApplicationLoadRequest(req, context),
            ReviewerConservationApplicationLoadRequest req => await ValidateReviewerConservationApplicationLoadRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateOrganizationApplicationDashboardLoadRequest(OrganizationApplicationDashboardLoadRequest request, ContextBase context)
    {
        // check if user is a global admin first
        var rolePermissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest
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

        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
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

    private async Task<ErrorBase> ValidateApplicantConservationApplicationLoadRequest(ApplicantConservationApplicationLoadRequest request, ContextBase context)
    {
        // Must be logged in
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        var submittedApplicationRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = true,
            ApplicationId = request.ApplicationId
        };
        var submittedApplicationResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(submittedApplicationRequest);

        if (!submittedApplicationResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id ${request.ApplicationId}");
        }

        // deny if the user is not the applicant
        if (userContext.UserId != submittedApplicationResponse.ApplicantUserId)
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private async Task<ErrorBase> ValidateReviewerConservationApplicationLoadRequest(ReviewerConservationApplicationLoadRequest request, ContextBase context)
    {
        // Must be logged in
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        var submittedApplicationRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = true,
            ApplicationId = request.ApplicationId
        };
        var submittedApplicationResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(submittedApplicationRequest);

        // deny if the application does not exist
        if (!submittedApplicationResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id ${request.ApplicationId}");
        }

        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = submittedApplicationResponse.FundingOrganizationId
        });

        // deny if the user does not have permission to perform reviews in this organization
        if (!orgPermissions.Contains(Permissions.ApplicationReview))
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
            WaterConservationApplicationSubmissionRequest req => await ValidateWaterConservationApplicationSubmissionRequest(req, context),
            WaterConservationApplicationSubmissionUpdateRequest req => await ValidateWaterConservationApplicationSubmissionUpdateRequest(req, context),
            WaterConservationApplicationRecommendationRequest req => await ValidateWaterConservationApplicationRecommendationRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateEvent(EventBase request, ContextBase context)
    {
        // Must be system context to process events
        _contextUtility.GetRequiredContext<SystemContext>();

        return request switch
        {
            WaterConservationApplicationSubmittedEvent => null,
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
        var inProgressApplicationExistsRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = false,
            ApplicantUserId = userContext.UserId,
            WaterRightNativeId = request.WaterRightNativeId
        };
        var applicationExistsResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(inProgressApplicationExistsRequest);

        if (!applicationExistsResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id {request.WaterConservationApplicationId}");
        }

        // user has an in-progress application for the requested water right
        // BUT user is attempting to link the estimate to a different application
        var estimateLinkedToIncorrectApplication = applicationExistsResponse.ApplicationId.Value != request.WaterConservationApplicationId;
        if (estimateLinkedToIncorrectApplication)
        {
            return CreateForbiddenError(request, context);
        }

        var polygonGeometries = request.Polygons.Select((polygonDetails) => GeometryHelpers.GetGeometryByWkt(polygonDetails.PolygonWkt)).ToArray();

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

    private async Task<ErrorBase> ValidateWaterConservationApplicationSubmissionRequest(WaterConservationApplicationSubmissionRequest request, ContextBase context)
    {
        // verify user creating the submission is linking it to an application they own
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var inProgressApplicationExistsRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = false,
            ApplicantUserId = userContext.UserId,
            WaterRightNativeId = request.WaterRightNativeId
        };
        var applicationExistsResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(inProgressApplicationExistsRequest);

        if (!applicationExistsResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id {request.WaterConservationApplicationId}");
        }

        var applicationLinkedToIncorrectApplication = applicationExistsResponse.ApplicationId.Value != request.WaterConservationApplicationId;
        if (applicationLinkedToIncorrectApplication)
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private async Task<ErrorBase> ValidateWaterConservationApplicationSubmissionUpdateRequest(WaterConservationApplicationSubmissionUpdateRequest request, ContextBase context)
    {
        // verify user is logged in
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        // verify application exists
        var submittedApplicationExistsRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = true,
            ApplicationId = request.WaterConservationApplicationId
        };
        var submittedApplicationExistsResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(submittedApplicationExistsRequest);

        if (!submittedApplicationExistsResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id {request.WaterConservationApplicationId}");
        }

        // verify application is in review
        if (submittedApplicationExistsResponse.Status != DTO.ConservationApplicationStatus.InReview)
        {
            return CreateValidationError(request, nameof(WaterConservationApplicationSubmissionUpdateRequest.WaterConservationApplicationId), "Application must be in review to be updated.");
        }

        // verify user belongs to the funding organization that is handling the application
        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = submittedApplicationExistsResponse.FundingOrganizationId
        });

        if (!orgPermissions.Contains(Permissions.ApplicationUpdate))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private async Task<ErrorBase> ValidateWaterConservationApplicationRecommendationRequest(WaterConservationApplicationRecommendationRequest request, ContextBase context)
    {
        // verify the user is logged in
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        // verify the application exists
        var submittedApplicationExistsRequest = new DTO.ApplicationExistsLoadRequest
        {
            HasSubmission = true,
            ApplicationId = request.WaterConservationApplicationId
        };

        var submittedApplicationExistsResponse = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(submittedApplicationExistsRequest);

        if (!submittedApplicationExistsResponse.ApplicationExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplication with Id {request.WaterConservationApplicationId}");
        }

        // verify the application is in review
        if (submittedApplicationExistsResponse.Status != DTO.ConservationApplicationStatus.InReview)
        {
            return CreateValidationError(request, nameof(WaterConservationApplicationRecommendationRequest.WaterConservationApplicationId),
                "Application must be in review status to receive a recommendation for final review.");
        }

        // verify the user has permissions to submit a recommendation
        var permissions = _securityUtility.Get(new DTO.OrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = submittedApplicationExistsResponse.FundingOrganizationId
        });

        if (!permissions.Contains(Permissions.ApplicationRecommendation))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private ErrorBase ValidateOrganizationLoadRequest(OrganizationLoadRequestBase request, ContextBase context)
    {
        return request switch
        {
            OrganizationDetailsListRequest req => ValidateOrganizationDetailsListRequest(req, context),
            OrganizationSummaryListRequest req => ValidateOrganizationSummaryListRequest(req, context),
            OrganizationFundingDetailsRequest req => ValidateOrganizationFundingDetailsRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private ErrorBase ValidateOrganizationDetailsListRequest(OrganizationDetailsListRequest request, ContextBase context)
    {
        var permissionsRequest = new DTO.UserPermissionsGetRequest()
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

    private ErrorBase ValidateOrganizationFundingDetailsRequest(OrganizationFundingDetailsRequest request, ContextBase context)
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
            OrganizationMemberRemoveRequest req => ValidateOrganizationMemberRemoveRequest(req, context),
            OrganizationMemberUpdateRequest req => ValidateOrganizationMemberUpdateRequest(req, context),
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
            return CreateValidationError(request, "UserId", "User is not allowed to add themselves to an organization since a user can only be in a single organization.");
        }

        var permissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest { Context = context });
        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
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

        // Verify the user's email domain matches the organization's
        var userProfileResponse = (DTO.UserProfileResponse)await _userAccessor.Load(new DTO.UserProfileRequest
            { UserId = request.UserId });
        var organizationEmailDomainResponse = (DTO.OrganizationLoadDetailsResponse)await _organizationAccessor.Load(new DTO.OrganizationLoadDetailsRequest
            { OrganizationId = request.OrganizationId });

        // There is validation to ensure the user email includes an '@'.
        // There isn't any validation or enforcement on whether the organization email domain includes an '@' or not, so we need to check for it.
        var userEmailDomain = userProfileResponse.UserProfile.Email.Split("@")[1];
        var organizationEmailDomain = organizationEmailDomainResponse.Organization.EmailDomain.Contains('@')
            ? organizationEmailDomainResponse.Organization.EmailDomain.Split("@")[1]
            : organizationEmailDomainResponse.Organization.EmailDomain;

        if (userEmailDomain.ToLower() != organizationEmailDomain.ToLower())
        {
            var errorMessage = "User's email domain does not match the organization's email domain.";
            return CreateValidationError(request, "emailDomain", errorMessage);
        }

        return null;
    }

    private ErrorBase ValidateOrganizationMemberRemoveRequest(OrganizationMemberRemoveRequest request, ContextBase context)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        if (userContext.UserId == request.UserId)
        {
            return CreateValidationError(request, "UserId", "User is not allowed to remove themselves from an organization.");
        }

        var permissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest { Context = context });
        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = request.OrganizationId
        });

        if (!permissions.Contains(Permissions.OrganizationMemberRemove) &&
            !orgPermissions.Contains(Permissions.OrganizationMemberRemove))
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private ErrorBase ValidateOrganizationMemberUpdateRequest(OrganizationMemberUpdateRequest request, ContextBase context)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        // Cannot edit your own organization roles.
        if (request.UserId == userContext.UserId)
        {
            return CreateValidationError(request, "UserId", "User is not allowed to modify their own organization role.");
        }

        var permissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest { Context = context });
        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = request.OrganizationId
        });

        if (!permissions.Contains(Permissions.OrganizationMemberUpdate) &&
            !orgPermissions.Contains(Permissions.OrganizationMemberUpdate))
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
            OrganizationUserListRequest req => ValidateOrganizationUserListRequest(req, context),
            UserListRequest => ValidateUserListRequest(context),
            UserProfileRequest req => ValidateUserProfileRequest(req, context),
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

    private ErrorBase ValidateOrganizationUserListRequest(OrganizationUserListRequest request, ContextBase context)
    {
        var organizationPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = request.OrganizationId
        });

        if (!organizationPermissions.Contains(Permissions.OrganizationUserList))
        {
            return CreateForbiddenError(new OrganizationUserListRequest(), context);
        }

        return null;
    }

    private ErrorBase ValidateUserListRequest(ContextBase context)
    {
        var permissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest { Context = context });

        // Must have permission at the non-organization level (Global Admin, etc)
        if (!permissions.Contains(Permissions.UserList))
        {
            return CreateForbiddenError(new UserListRequest(), context);
        }

        return null;
    }

    private ErrorBase ValidateUserProfileRequest(UserProfileRequest request, ContextBase context)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        if (request.UserId != userContext.UserId)
        {
            return CreateForbiddenError(request, context);
        }

        return null;
    }

    private ErrorBase ValidateUserSearchRequest(ContextBase context)
    {
        var permissions = _securityUtility.Get(new DTO.UserPermissionsGetRequest { Context = context });

        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
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

    private ErrorBase ValidateUserStoreRequest(UserStoreRequestBase request)
    {
        return request switch
        {
            UserProfileCreateRequest => ValidateUserProfileCreateRequest(),
            UserProfileUpdateRequest => ValidateUserProfileUpdateRequest(),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateUserProfileCreateRequest()
    {
        // Must be logged in
        _contextUtility.GetRequiredContext<UserContext>();

        return null;
    }

    private ErrorBase ValidateUserProfileUpdateRequest()
    {
        // Must be logged in
        _contextUtility.GetRequiredContext<UserContext>();

        return null;
    }

    private async Task<ErrorBase> ValidateFileSasTokenRequest(FileSasTokenRequestBase request, ContextBase context)
    {
        return request switch
        {
            ApplicationDocumentUploadSasTokenRequest req => ValidateApplicationDocumentUploadSasTokenRequest(req, context),
            ApplicationDocumentDownloadSasTokenRequest req => await ValidateApplicationDocumentDownloadSasTokenRequest(req, context),
            _ => throw new NotImplementedException(
                $"Validation for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }

    private ErrorBase ValidateApplicationDocumentUploadSasTokenRequest(ApplicationDocumentUploadSasTokenRequest request, ContextBase context)
    {
        // User must be logged in
        _contextUtility.GetRequiredContext<UserContext>();

        return null;
    }

    private async Task<ErrorBase> ValidateApplicationDocumentDownloadSasTokenRequest(ApplicationDocumentDownloadSasTokenRequest request, ContextBase context)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        var documentExistsRequest = new DTO.ApplicationSupportingDocumentExistsRequest
        {
            WaterConservationApplicationDocumentId = request.WaterConservationApplicationDocumentId
        };

        var documentExistsResponse = (DTO.ApplicationSupportingDocumentExistsResponse)await _applicationAccessor.Load(documentExistsRequest);

        if (!documentExistsResponse.DocumentExists)
        {
            return CreateNotFoundError(context, $"WaterConservationApplicationDocument with Id ${request.WaterConservationApplicationDocumentId}");
        }

        // Current user owns the application, so allow file download
        if (userContext.UserId == documentExistsResponse.ApplicantUserId)
        {
            return null;
        }

        // Check if current user is a member of the application funding organization
        var orgPermissions = _securityUtility.Get(new DTO.UserOrganizationPermissionsGetRequest
        {
            Context = context,
            OrganizationId = documentExistsResponse.FundingOrganizationId
        });

        if (!orgPermissions.Contains(Permissions.ApplicationReview))
        {
            return CreateForbiddenError(new ApplicationDocumentDownloadSasTokenRequest(), context);
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