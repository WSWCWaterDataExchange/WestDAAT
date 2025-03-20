CREATE TABLE WaterConservationApplicationSubmissionNotes
(
    Id                                          UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT PK_WaterConservationApplicationSubmissionNotes_Id PRIMARY KEY NONCLUSTERED 
        CONSTRAINT DF_WaterConservationApplicationSubmissionNotes_Id DEFAULT NEWID(),
    WaterConservationApplicationSubmissionId    UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT FK_WaterConservationApplicationSubmissionNotes_WaterConservationApplicationSubmissions 
            FOREIGN KEY REFERENCES WaterConservationApplicationSubmissions (Id),
    UserId                                      UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT FK_WaterConservationApplicationSubmissionNotes_Users 
            FOREIGN KEY REFERENCES Users (Id),
    Timestamp                                   DATETIMEOFFSET   NOT NULL,
    Text                                        NVARCHAR(4000)   NOT NULL,
);

CREATE INDEX IX_ApplicationSubmissionNotes_WaterConservationApplicationSubmissionId ON WaterConservationApplicationSubmissionNotes(WaterConservationApplicationSubmissionId);

CREATE INDEX IX_ApplicationSubmissionNotes_UserId ON WaterConservationApplicationSubmissionNotes(UserId);