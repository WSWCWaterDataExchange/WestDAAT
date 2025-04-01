-- update Estimates table
ALTER TABLE dbo.WaterConservationApplicationEstimates ADD
	AverageYearlyEffectivePrecipitationInAcreFeet FLOAT NULL,
	AverageYearlyNetEtInAcreFeet FLOAT NULL;

-- sp_rename handles renaming the column in the History table automatically
exec sp_rename 'dbo.WaterConservationApplicationEstimates.TotalAverageYearlyConsumptionEtAcreFeet', 'AverageYearlyTotalEtInAcreFeet', 'COLUMN';


-- update EstimateLocationConsumptiveUses table
ALTER TABLE dbo.WaterConservationApplicationEstimateLocationConsumptiveUses ADD
	EffectivePrecipitationInInches FLOAT NULL,
	NetEtInInches FLOAT NULL;

exec sp_rename 'dbo.WaterConservationApplicationEstimateLocationConsumptiveUses.EtInInches', 'TotalEtInInches', 'COLUMN';

-- rename EstimateLocationConsumptiveUses table
exec sp_rename 'dbo.WaterConservationApplicationEstimateLocationConsumptiveUses', 'LocationWaterMeasurements';

exec sp_rename 'PK_WaterConservationApplicationEstimateLocationConsumptiveUses_Id', 'PK_LocationWaterMeasurements_Id';
exec sp_rename 'DF_WaterConservationApplicationEstimateLocationConsumptiveUses_Id', 'DF_LocationWaterMeasurements_Id';
