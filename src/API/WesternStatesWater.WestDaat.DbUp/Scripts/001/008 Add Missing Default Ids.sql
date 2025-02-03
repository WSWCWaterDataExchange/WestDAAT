ALTER TABLE WaterConservationApplications
	ADD CONSTRAINT DF_WaterConservationApplications_Id DEFAULT NEWID() FOR Id;
	
ALTER TABLE WaterConservationApplicationSubmissions
	ADD CONSTRAINT DF_WaterConservationApplicationSubmissions_Id DEFAULT NEWID() FOR Id;

ALTER TABLE WaterConservationApplicationEstimates
	ADD CONSTRAINT DF_WaterConservationApplicationEstimates_Id DEFAULT NEWID() FOR Id;

ALTER TABLE WaterConservationApplicationEstimateLocations
	ADD CONSTRAINT DF_WaterConservationApplicationEstimateLocations_Id DEFAULT NEWID() FOR Id;

ALTER TABLE WaterConservationApplicationEstimateLocationConsumptiveUses
	ADD CONSTRAINT DF_WaterConservationApplicationEstimateLocationConsumptiveUses_Id DEFAULT NEWID() FOR Id;