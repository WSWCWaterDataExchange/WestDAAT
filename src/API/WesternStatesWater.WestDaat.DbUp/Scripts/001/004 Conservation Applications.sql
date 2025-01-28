CREATE TABLE WaterConservationApplications
(
    Id 	                    UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplications_Id PRIMARY KEY NONCLUSTERED,
    ApplicantUserId         UNIQUEIDENTIFIER NOT NULL,
    FundingOrganizationId   UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Applications_Users FOREIGN KEY (ApplicantUserId) REFERENCES Users (Id),
    CONSTRAINT FK_Applications_FundingOrganizations FOREIGN KEY (FundingOrganizationId) REFERENCES Organizations (Id)
);

CREATE INDEX IX_WaterConservationApplications_ApplicantUserId ON WaterConservationApplications(ApplicantUserId);
CREATE INDEX IX_WaterConservationApplications_FundingOrganizationId ON WaterConservationApplications(OrganizationId);

CREATE TABLE WaterConservationApplicationSubmissions
(
    Id 	                            UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplicationSubmissions_Id PRIMARY KEY NONCLUSTERED,
    WaterConservationApplicationId  UNIQUEIDENTIFIER NOT NULL UNIQUE, -- application can only have one submission
    SubmittedDate                   DATETIMEOFFSET NOT NULL,
    CompensationRateDollars         int NOT NULL,
    CompensationRateUnits           int NOT NULL,
    ApplicationDisplayId            NVARCHAR(255) NOT NULL,
    WaterRightNativeId              NVARCHAR(255) NOT NULL,
    AcceptedDate                    DATETIMEOFFSET NULL,
    RejectedDate                    DATETIMEOFFSET NULL,
    CONSTRAINT FK_WaterConservationApplicationSubmissions_WaterConservationApplications FOREIGN KEY (WaterConservationApplicationId) REFERENCES WaterConservationApplications (Id)
)

CREATE INDEX IX_WaterConservationApplicationSubmissions_WaterConservationApplicationId ON WaterConservationApplicationSubmissions(WaterConservationApplicationId);
