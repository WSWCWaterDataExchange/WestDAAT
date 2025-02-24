ALTER TABLE dbo.UserProfiles ADD
    State NVARCHAR(2) NULL,
    Country NVARCHAR(50) NULL,
    PhoneNumber NVARCHAR(50) NULL;
go

-- Set data for existing records
UPDATE dbo.UserProfiles SET
    State = 'CA',
    Country = 'USA',
    PhoneNumber = '11231234'

-- Make columns non-null
ALTER TABLE dbo.UserProfiles ALTER COLUMN
    State NVARCHAR(50) NOT NULL
    
ALTER TABLE dbo.UserProfiles ALTER COLUMN
    Country NVARCHAR(50) NOT NULL
    
ALTER TABLE dbo.UserProfiles ALTER COLUMN
    PhoneNumber NVARCHAR(50) NOT NULL;
