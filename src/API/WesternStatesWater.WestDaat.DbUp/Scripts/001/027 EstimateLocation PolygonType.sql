ALTER TABLE dbo.WaterConservationApplicationEstimateLocations ADD
	PolygonType INT NOT NULL 
		CONSTRAINT DF_PolygonType_Temp DEFAULT 0;

GO;

ALTER TABLE dbo.WaterConservationApplicationEstimateLocations DROP
	CONSTRAINT DF_PolygonType_Temp;