-- make existing columns optional
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN AgentEmail NVARCHAR(255) NULL;
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN AgentPhoneNumber NVARCHAR(50) NULL;
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN CanalOrIrrigationEntityName NVARCHAR(255) NULL;
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN CanalOrIrrigationEntityEmail NVARCHAR(255) NULL;
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN CanalOrIrrigationEntityPhoneNumber NVARCHAR(50) NULL;
