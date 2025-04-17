-- remove entries for which adding the new constraint would result in an error
DELETE from dbo.LocationWaterMeasurements
WHERE WaterConservationApplicationEstimateLocationId IN
(
	select distinct WaterConservationApplicationEstimateLocationId from dbo.LocationWaterMeasurements
	WHERE WaterConservationApplicationEstimateLocationId NOT IN
	(SELECT Id from dbo.WaterConservationApplicationEstimateLocations)
);

ALTER TABLE dbo.LocationWaterMeasurements ADD 
	CONSTRAINT FK_LocationWaterMeasurements_WaterConservationApplicationEstimateLocations
	FOREIGN KEY (WaterConservationApplicationEstimateLocationId)
	REFERENCES dbo.WaterConservationApplicationEstimateLocations (Id);
