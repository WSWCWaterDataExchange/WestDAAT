-- Add the OpenET columns
ALTER TABLE [Organizations]
ADD 
    [OpenEtModel] INT NULL,
    [OpenEtDateRangeInYears] INT NULL,
    [OpenEtCompensationRateModel] NVARCHAR(4000) NULL;
GO

-- For all existing records, set default values
UPDATE [Organizations]
SET
    [OpenEtModel] = 1,
    [OpenEtDateRangeInYears] = 10,
    [OpenEtCompensationRateModel] = 'Lorem ipsum';

-- Make columns non-nullable
ALTER TABLE [Organizations]
    ALTER COLUMN [OpenEtModel] INT NOT NULL;

ALTER TABLE [Organizations]
    ALTER COLUMN [OpenEtDateRangeInYears] INT NOT NULL;

ALTER TABLE [Organizations]
    ADD CONSTRAINT CHK_OpenEtDateRangeInYears CHECK (
        OpenEtDateRangeInYears >= 1 AND
        OpenEtDateRangeInYears <= 10
    );

ALTER TABLE [Organizations]
    ALTER COLUMN [OpenEtCompensationRateModel] NVARCHAR(4000) NOT NULL;

GO;
