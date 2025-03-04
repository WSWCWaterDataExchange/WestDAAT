-- Update existing data if it exists
UPDATE dbo.UserProfiles
SET State = 'CA'
WHERE LEN(State) > 2;

ALTER TABLE dbo.UserProfiles
    ALTER COLUMN State NVARCHAR(2) NOT NULL;