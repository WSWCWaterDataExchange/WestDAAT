CREATE TABLE WaterConservationApplicationEstimateControlLocations
(
    Id                                          UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT PK_WaterConservationApplicationEstimateControlLocations_Id PRIMARY KEY NONCLUSTERED 
        CONSTRAINT DF_WaterConservationApplicationEstimateControlLocations_Id DEFAULT NEWID(),
    WaterConservationApplicationEstimateId      UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT FK_WaterConservationApplicationEstimateControlLocations_WaterConservationApplicationEstimates
            FOREIGN KEY REFERENCES WaterConservationApplicationEstimates (Id),
    PointWkt                                    NVARCHAR(100)    NOT NULL,
    ValidFrom                                   DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN
        CONSTRAINT DF_WaterConservationApplicationEstimateControlLocations_ValidFrom DEFAULT SYSUTCDATETIME(),
    ValidTo                                     DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN
        CONSTRAINT DF_WaterConservationApplicationEstimateControlLocations_ValidTo DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999'),
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.WaterConservationApplicationEstimateControlLocationsHistory));

CREATE INDEX IX_WaterConservationApplicationEstimateControlLocations_WaterConservationApplicationEstimateId
    ON WaterConservationApplicationEstimateControlLocations (WaterConservationApplicationEstimateId);


CREATE TABLE ControlLocationWaterMeasurements
(
    Id                                                    UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT PK_ControlLocationWaterMeasurements_Id PRIMARY KEY NONCLUSTERED
        CONSTRAINT DF_ControlLocationWaterMeasurements_Id DEFAULT NEWID(),
    WaterConservationApplicationEstimateControlLocationId UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT FK_ControlLocationWaterMeasurements_WaterConservationApplicationEstimateControlLocations
            FOREIGN KEY REFERENCES WaterConservationApplicationEstimateControlLocations (Id),
    [Year]                                                INT NOT NULL,
    TotalEtInInches                                       FLOAT NOT NULL
);

CREATE INDEX IX_ControlLocationWaterMeasurements_WaterConservationApplicationEstimateControlLocationId
    ON ControlLocationWaterMeasurements (WaterConservationApplicationEstimateControlLocationId);