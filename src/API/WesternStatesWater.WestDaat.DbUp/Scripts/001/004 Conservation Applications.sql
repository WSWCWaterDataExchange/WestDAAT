CREATE TABLE WaterConservationApplications
(
    Id 	                    UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplications_Id PRIMARY KEY NONCLUSTERED,
    ApplicantUserId         UNIQUEIDENTIFIER NOT NULL,
    FundingOrganizationId   UNIQUEIDENTIFIER NOT NULL,
    SubmittedDate           DATETIMEOFFSET NOT NULL,
    CompensationRateDollars int NOT NULL,
    CompensationRateUnits   int NOT NULL,
    ApplicationDisplayId    NVARCHAR(255) NOT NULL,
    WaterRightNativeId      NVARCHAR(255) NOT NULL,
    AcceptedDate            DATETIMEOFFSET NULL,
    RejectedDate            DATETIMEOFFSET NULL,
    CONSTRAINT FK_Applications_Users FOREIGN KEY (ApplicantUserId) REFERENCES Users (Id),
    CONSTRAINT FK_Applications_FundingOrganizations FOREIGN KEY (FundingOrganizationId) REFERENCES Organizations (Id)
);

CREATE INDEX IX_WaterConservationApplications_ApplicantUserId ON WaterConservationApplications(ApplicantUserId);
CREATE INDEX IX_WaterConservationApplications_FundingOrganizationId ON WaterConservationApplications(OrganizationId);
