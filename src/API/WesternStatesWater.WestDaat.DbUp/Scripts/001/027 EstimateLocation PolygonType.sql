ALTER TABLE dbo.WaterConservationApplicationEstimateLocations ADD
	DrawToolType INT NOT NULL 
		CONSTRAINT DF_DrawToolType_Temp DEFAULT 1;

GO;

ALTER TABLE dbo.WaterConservationApplicationEstimateLocations DROP
	CONSTRAINT DF_DrawToolType_Temp;