CREATE TABLE WaterConservationApplicationDocuments
(
    Id                              UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_WaterConservationApplicationDocuments_Id PRIMARY KEY NONCLUSTERED CONSTRAINT DF_WaterConservationApplicationDocuments_Id DEFAULT NEWID(),
    WaterConservationApplicationId  UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_WaterConservationApplicationDocuments_WaterConservationApplications FOREIGN KEY REFERENCES WaterConservationApplications (Id),
    FileName                        NVARCHAR(255)    NOT NULL,
    BlobName                        NVARCHAR(255)    NOT NULL,
    Description                     NVARCHAR(4000)
);

CREATE INDEX IX_ApplicationDocuments_WaterConservationApplicationId ON WaterConservationApplicationDocuments(WaterConservationApplicationId);