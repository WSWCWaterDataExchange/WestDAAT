ALTER TABLE WaterConservationApplications
    ADD CONSTRAINT DF_WaterConservationApplications_Id DEFAULT NEWID() FOR Id;

ALTER TABLE WaterConservationApplicationsSubmissions
    ADD CONSTRAINT DF_WaterConservationApplications_Id DEFAULT NEWID() FOR Id;