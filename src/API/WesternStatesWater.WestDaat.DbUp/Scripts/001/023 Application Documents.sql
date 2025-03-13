CREATE TABLE ApplicationDocuments
(
    Id                              UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_ApplicationDocuments_Id PRIMARY KEY NONCLUSTERED CONSTRAINT DF_ApplicationDocuments_Id DEFAULT NEWID(),
    WaterConservationApplicationId  UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_ApplicationDocuments_WaterConservationApplications FOREIGN KEY REFERENCES WaterConservationApplications (Id),
    BlobName                        NVARCHAR(255)    NOT NULL
);

CREATE INDEX IX_ApplicationDocuments_WaterConservationApplicationId ON ApplicationDocuments(WaterConservationApplicationId);