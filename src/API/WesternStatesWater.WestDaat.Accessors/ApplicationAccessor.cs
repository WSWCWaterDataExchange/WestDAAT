using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

internal class ApplicationAccessor : AccessorBase, IApplicationAccessor
{
    private readonly EF.IDatabaseContextFactory _databaseContextFactory;
    private readonly EFWD.IWestDaatDatabaseContextFactory _westDaatDatabaseContextFactory;

    public ApplicationAccessor(ILogger<ApplicationAccessor> logger,
        EF.IDatabaseContextFactory databaseContextFactory,
        EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
        _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
    }

    public async Task<ApplicationLoadResponseBase> Load(ApplicationLoadRequestBase request)
    {
        return request switch
        {
            ApplicationDashboardLoadRequest req => await GetDashboardApplications(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<ApplicationDashboardLoadResponse> GetDashboardApplications(ApplicationDashboardLoadRequest request)
    {
        // Figure out how we need to get applications
        // 1A. is it by organization id
        //     - is it for all organizations or specific ones?
        // 1B. is it by applicant user id
        //
        // Then get all apps for the specified organizations
        // but only ones who have submitted applications
        //
        // and then go get all the other data


        await using var db = _westDaatDatabaseContextFactory.Create();

        var organizationIds = request.OrganizationId;
        var applications = await db.WaterConservationApplications
            .Join(db.WaterConservationApplicationSubmissions,
                app => app.Id,
                sub => sub.WaterConservationApplicationId,
                (app, sub) => new 
                {
                    ApplicationId = app.Id,
                    ApplicationDisplayId = app.ApplicationDisplayId,
                    ApplicantUserId = app.ApplicantUserId,
                    OrganizationId = app.FundingOrganizationId,
                    WaterRightNativeId = app.WaterRightNativeId,
                    SubmittedDate = sub.SubmittedDate,
                    AcceptedDate = sub.AcceptedDate,
                    RejectedDate = sub.RejectedDate,
                    // CompensationRateDollars = sub.CompensationRateDollars,
                    // CompensationRateUnits = sub.CompensationRateUnits
                })
            // .Where((app, sub) => app.OrganizationId == request.OrganizationId)
            .Join(db.UserProfiles,
                info => info.ApplicantUserId,
                profile => profile.UserId,
                (info, profile) => new
                {
            info.ApplicationId,
            info.ApplicationDisplayId,
            info.OrganizationId,
            info.WaterRightNativeId,
            info.SubmittedDate,
            info.AcceptedDate,
            info.RejectedDate,
            //         info.CompensationRateDollars,
            //         info.CompensationRateUnits,
                ApplicantFirstName = profile.FirstName,
                ApplicantLastName = profile.LastName,
            })
            .Join(db.Organizations,
                info => info.OrganizationId,
                org => org.Id,
                (info, org) => new ApplicationDashboardLoadDetails
                {
            ApplicationId = info.ApplicationId,
            ApplicationDisplayId = info.ApplicationDisplayId,
            WaterRightNativeId = info.WaterRightNativeId,
            SubmittedDate = info.SubmittedDate,
            AcceptedDate = info.AcceptedDate,
            RejectedDate = info.RejectedDate,
            //         CompensationRateDollars = info.CompensationRateDollars,
            //         CompensationRateUnits = info.CompensationRateUnits,
            ApplicantFirstName = info.ApplicantFirstName,
            ApplicantLastName = info.ApplicantLastName,
            OrganizationName = org.Name
            }).ToListAsync();
        
        // TODO: should there be a default sort order?

        return new ApplicationDashboardLoadResponse
        {
            Applications = applications.ToArray()
        };
    }
}