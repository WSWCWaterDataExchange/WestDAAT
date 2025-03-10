-- Add the UserName column
ALTER TABLE [UserProfiles]
    ADD [UserName] NVARCHAR(100) NULL;
GO

-- For all existing records, set UserName to random string with length 10
UPDATE [UserProfiles]
SET [UserName] = LEFT(NEWID(), 10);


-- Make UserName non-nullable
ALTER TABLE [UserProfiles]
    ALTER COLUMN [UserName] NVARCHAR(100) NOT NULL;
GO

-- Create unique index on UserName to prevent duplicates
CREATE UNIQUE INDEX IX_UserProfile_UserName
    ON [UserProfiles] ([UserName]);
GO