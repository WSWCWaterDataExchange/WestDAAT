ALTER TABLE WaterConservationApplications
	ADD CONSTRAINT UQ_WaterConservationApplications_ApplicationDisplayId UNIQUE (ApplicationDisplayId);

ALTER TABLE Organizations
	ADD AbbreviatedName NVARCHAR(255) NOT NULL;
