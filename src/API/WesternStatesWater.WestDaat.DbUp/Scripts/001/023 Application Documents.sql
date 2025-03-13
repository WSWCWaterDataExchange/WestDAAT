CREATE TABLE ApplicationDocuments
(
    Id                              UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_ApplicationDocuments_Id PRIMARY KEY NONCLUSTERED,
    WaterConservationApplicationId  UNIQUEIDENTIFIER NOT NULL,
    BlobName                        NVARCHAR(255)    NOT NULL,
    CONSTRAINT FK_ApplicationDocuments_WaterConservationApplications FOREIGN KEY (WaterConservationApplicationId) REFERENCES WaterConservationApplications (Id),
);

CREATE INDEX IX_ApplicationDocuments_WaterConservationApplicationId ON ApplicationDocuments(WaterConservationApplicationId);