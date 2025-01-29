CREATE TABLE WaterConservationApplicationEstimates
(
    Id 	                            UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplicationEstimates_Id PRIMARY KEY NONCLUSTERED,
    WaterConservationApplicationId  UNIQUEIDENTIFIER NOT NULL,
    Model                           INT NOT NULL,
    DateRangeStart                  DATE NOT NULL,
    DateRangeEnd                    DATE NOT NULL,
    CompensationRateDollars		    INT NOT NULL,
    CompensationRateUnits           INT NOT NULL,
    TotalPolygonAreaAcres           FLOAT NOT NULL,
    TotalEtInches                   FLOAT NOT NULL,
    EstimatedCompensationDollars    INT NOT NULL,
    CONSTRAINT FK_WaterConservationApplicationsEstimates_WaterConservationApplications FOREIGN KEY (WaterConservationApplicationId) REFERENCES WaterConservationApplications (Id),
);

CREATE INDEX IX_WaterConservationApplicationEstimates_WaterConservationApplicationId ON WaterConservationApplicationEstimates(WaterConservationApplicationId);

CREATE TABLE WaterConservationApplicationEstimatePolygons
(
    Id                                     UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplicationEstimatePolygons_Id PRIMARY KEY NONCLUSTERED,
    WaterConservationApplicationEstimateId UNIQUEIDENTIFIER NOT NULL,
    PolygonWkt							   NVARCHAR(4000) NOT NULL,
    CONSTRAINT FK_WaterConservationApplicationEstimatePolygons_WaterConservationApplicationEstimates FOREIGN KEY (WaterConservationApplicationEstimateId) REFERENCES WaterConservationApplicationEstimates (Id),
);
