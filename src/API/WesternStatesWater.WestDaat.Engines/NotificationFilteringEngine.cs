using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FilteringEngine : INotificationFilteringEngine
{
    public async Task<DTO.NotificationMetaBase[]> Filter<T>(T filterEvent)
    {
        return filterEvent switch
        {
            DTO.WaterConservationApplicationSubmittedEvent e => await FilterWaterConservationApplicationSubmittedEvent(e),
            _ => throw new NotImplementedException($"Filtering for type {typeof(T).Name} has not been implemented.")
        };
    }

    private async Task<DTO.WaterConservationApplicationSubmittedNotificationMeta[]> FilterWaterConservationApplicationSubmittedEvent(
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

        var notificationUserResponse = (DTO.NotificationUserResponse)await _userAccessor.Load(new DTO.NotificationUserRequest
        {
            UserId = application.ApplicantUserId.Value,
        });

        return
        [
            new DTO.WaterConservationApplicationSubmittedNotificationMeta
            {
                ApplicationId = @event.ApplicationId,
                ToUser = notificationUserResponse.User,
                Type = DTO.NotificationType.Email
            }
        ];
    }
}