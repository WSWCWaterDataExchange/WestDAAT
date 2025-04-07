using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FilteringEngine : INotificationFilteringEngine
{
    public async Task<DTO.NotificationMetaBase[]> Filter<T>(T filterEvent)
    {
        return filterEvent switch
        {
            DTO.WaterConservationApplicationSubmittedEvent e => await FilterWaterConservationApplicationSubmittedEvent(e),
            DTO.WaterConservationApplicationRecommendedEvent e => await FilterWaterConservationApplicationRecommendedEvent(e),
            _ => throw new NotImplementedException($"Filtering for type {typeof(T).Name} has not been implemented.")
        };
    }

    private async Task<DTO.NotificationMetaBase[]> FilterWaterConservationApplicationSubmittedEvent(
        DTO.WaterConservationApplicationSubmittedEvent @event)
    {
        var application = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(new DTO.ApplicationExistsLoadRequest
        {
            ApplicationId = @event.ApplicationId,
            HasSubmission = true
        });

        if (application?.ApplicantUserId == null)
        {
            throw new WestDaatException("Application not found, or it does contain an applicant user.");
        }

        var applicantNotification = await BuildApplicationSubmittedApplicantNotification(@event, application);
        var fundingOrganizationNotifications = await BuildApplicationSubmittedFundingOrganizationNotifications(@event, application);
        var adminNotifications = await BuildApplicationSubmittedAdministratorNotifications(@event, application);

        return
        [
            applicantNotification,
            .. fundingOrganizationNotifications,
            .. adminNotifications
        ];
    }

    private async Task<DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta> BuildApplicationSubmittedApplicantNotification(
        DTO.WaterConservationApplicationSubmittedEvent @event,
        DTO.ApplicationExistsLoadResponse application
    )
    {
        var notificationUserResponse = (DTO.NotificationUserResponse)await _userAccessor.Load(new DTO.NotificationUserRequest
        {
            UserId = application.ApplicantUserId.Value,
        });
        var applicantNotification = new DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta
        {
            ApplicationId = @event.ApplicationId,
            ToUser = notificationUserResponse.User,
            Type = DTO.NotificationType.Email
        };
        return applicantNotification;
    }

    private async Task<DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta[]> BuildApplicationSubmittedFundingOrganizationNotifications(
        DTO.WaterConservationApplicationSubmittedEvent @event,
        DTO.ApplicationExistsLoadResponse application
    )
    {
        var fundingOrganizationUsers = (DTO.UserListResponse)await _userAccessor.Load(new DTO.UserListRequest
        {
            OrganizationId = application.FundingOrganizationId.Value,
        });


        var fundingOrganizationNotifications = fundingOrganizationUsers.Users
            .Select(orgUser => new DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta
            {
                ApplicationId = @event.ApplicationId,
                ToUser = new DTO.NotificationUser
                {
                    EmailAddress = orgUser.Email
                },
                Type = DTO.NotificationType.Email,
                ToUserPermissions = _securityUtility.Get(new DTO.RolePermissionsGetRequest
                {
                    Role = orgUser.Role
                })
            })
            .ToArray();

        return fundingOrganizationNotifications;
    }

    private async Task<DTO.WaterConservationApplicationSubmittedAdminNotificationMeta[]> BuildApplicationSubmittedAdministratorNotifications(
        DTO.WaterConservationApplicationSubmittedEvent @event,
        DTO.ApplicationExistsLoadResponse application
    )
    {
        var adminUsers = (DTO.UserListResponse)await _userAccessor.Load(new DTO.UserListRequest
        {
            IncludeGlobalAdministrators = true
        });

        var adminNotifications = adminUsers.Users
            .Select(adminUser => new DTO.WaterConservationApplicationSubmittedAdminNotificationMeta
            {
                ApplicationId = @event.ApplicationId,
                ToUser = new DTO.NotificationUser
                {
                    EmailAddress = adminUser.Email
                },
                Type = DTO.NotificationType.Email,
                FundingOrganizationName = application.FundingOrganizationName,
            })
            .ToArray();

        return adminNotifications;
    }

    private async Task<DTO.NotificationMetaBase[]> FilterWaterConservationApplicationRecommendedEvent(
        DTO.WaterConservationApplicationRecommendedEvent @event)
    {
        var application = (DTO.ApplicationExistsLoadResponse)await _applicationAccessor.Load(new DTO.ApplicationExistsLoadRequest
        {
            ApplicationId = @event.ApplicationId,
            HasSubmission = true
        });

        if (application?.ApplicantUserId == null)
        {
            throw new WestDaatException("Application not found, or it does contain an applicant user.");
        }

        DTO.NotificationMetaBase[] fundingOrganizationNotifications = await BuildApplicationRecommendedFundingOrganizationNotifications(@event, application);

        return fundingOrganizationNotifications;
    }

    private async Task<DTO.WaterConservationApplicationRecommendedNotificationMeta[]> BuildApplicationRecommendedFundingOrganizationNotifications(
        DTO.WaterConservationApplicationRecommendedEvent @event,
        DTO.ApplicationExistsLoadResponse application
    )
    {
        var fundingOrganizationUsers = (DTO.UserListResponse)await _userAccessor.Load(new DTO.UserListRequest
        {
            OrganizationId = application.FundingOrganizationId.Value,
        });

        // Only send to users that are next up in the review pipeline
        var finalApprovalUsers = fundingOrganizationUsers.Users.Where(u =>
        {
            var permissions = _securityUtility.Get(new DTO.RolePermissionsGetRequest
            {
                Role = u.Role
            });

            var hasFinalApprovalPermission = permissions.Any(p => p == Permissions.ApplicationApprove);
            return hasFinalApprovalPermission;
        });

        var fundingOrganizationNotifications = finalApprovalUsers
            .Select(approver => new DTO.WaterConservationApplicationRecommendedNotificationMeta
            {
                ApplicationId = @event.ApplicationId,
                ToUser = new DTO.NotificationUser
                {
                    EmailAddress = approver.Email
                },
                Type = DTO.NotificationType.Email,
            })
            .ToArray();

        return fundingOrganizationNotifications;
    }
}