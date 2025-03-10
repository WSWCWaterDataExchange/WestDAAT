-- remove columns
ALTER TABLE dbo.WaterConservationApplicationSubmissions DROP COLUMN 
	AgentLastName,
	LandownerLastName,
	ProjectLocation,
	PropertyAdditionalDetails,
	DiversionPoint,
	DiversionPointDetails;

go;

-- add new columns
ALTER TABLE dbo.WaterConservationApplicationSubmissions ADD
	AgentAdditionalDetails NVARCHAR(4000) NULL,
	CanalOrIrrigationAdditionalDetails NVARCHAR(4000) NULL;

go;

-- modify existing columns
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN AgentFirstName NVARCHAR(255) NULL;
ALTER TABLE dbo.WaterConservationApplicationSubmissions ALTER COLUMN LandownerFirstName NVARCHAR(255) NOT NULL;

EXEC sp_rename 'dbo.WaterConservationApplicationSubmissions.AgentFirstName', 'AgentName', 'COLUMN';
EXEC sp_rename 'dbo.WaterConservationApplicationSubmissions.LandownerFirstName', 'LandownerName', 'COLUMN';
