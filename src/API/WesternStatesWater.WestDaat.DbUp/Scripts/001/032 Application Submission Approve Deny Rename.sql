exec sp_rename 'dbo.WaterConservationApplicationSubmissions.AcceptedDate', 'ApprovedDate', 'COLUMN';
exec sp_rename 'dbo.WaterConservationApplicationSubmissions.RejectedDate', 'DeniedDate', 'COLUMN';