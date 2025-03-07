ALTER TABLE dbo.UserProfiles
ADD IsSignupComplete bit NOT NULL CONSTRAINT DF_IsSignupComplete DEFAULT 0;