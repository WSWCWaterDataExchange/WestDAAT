ALTER TABLE dbo.WaterConservationApplicationSubmissions ADD
    RecommendedByUserId     UNIQUEIDENTIFIER NULL CONSTRAINT FK_WaterConservationApplicationSubmissions_RecommendedByUserId FOREIGN KEY REFERENCES Users (Id),
    RecommendedForDate      DATETIMEOFFSET   NULL,
    RecommendedAgainstDate  DATETIMEOFFSET   NULL;

