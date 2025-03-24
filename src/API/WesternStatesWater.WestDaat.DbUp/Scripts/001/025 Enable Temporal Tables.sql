ALTER TABLE dbo.WaterConservationApplicationSubmissions ADD
	[ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN 
		CONSTRAINT DF_WaterConservationApplicationSubmissions_ValidFrom DEFAULT SYSUTCDATETIME(),
	[ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN 
		CONSTRAINT DF_WaterConservationApplicationSubmissions_ValidTo DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999'),
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);

ALTER TABLE dbo.WaterConservationApplicationSubmissions SET 
(
	SYSTEM_VERSIONING = ON 
	(HISTORY_TABLE = dbo.WaterConservationApplicationSubmissionsHistory)
);



ALTER TABLE dbo.WaterConservationApplicationEstimates ADD 
	[ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN
		CONSTRAINT DF_WaterConservationApplicationEstimates_ValidFrom DEFAULT SYSUTCDATETIME(),
	[ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN
		CONSTRAINT DF_WaterConservationApplicationEstimates_ValidTo DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999'),
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);

ALTER TABLE dbo.WaterConservationApplicationEstimates SET 
(
	SYSTEM_VERSIONING = ON 
	(HISTORY_TABLE = dbo.WaterConservationApplicationEstimatesHistory)
);



ALTER TABLE dbo.WaterConservationApplicationEstimateLocations ADD 
	[ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN
		CONSTRAINT DF_WaterConservationApplicationEstimateLocations_ValidFrom DEFAULT SYSUTCDATETIME(),
	[ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN
		CONSTRAINT DF_WaterConservationApplicationEstimateLocations_ValidTo DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999'),
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);

ALTER TABLE dbo.WaterConservationApplicationEstimateLocations SET 
(
	SYSTEM_VERSIONING = ON 
	(HISTORY_TABLE = dbo.WaterConservationApplicationEstimateLocationsHistory)
);



ALTER TABLE dbo.WaterConservationApplicationDocuments ADD 
	[ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN
		CONSTRAINT DF_WaterConservationApplicationDocuments_ValidFrom DEFAULT SYSUTCDATETIME(),
	[ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN
		CONSTRAINT DF_WaterConservationApplicationDocuments_ValidTo DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999'),
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);

ALTER TABLE dbo.WaterConservationApplicationDocuments SET 
(
	SYSTEM_VERSIONING = ON 
	(HISTORY_TABLE = dbo.WaterConservationApplicationDocumentsHistory)
);
