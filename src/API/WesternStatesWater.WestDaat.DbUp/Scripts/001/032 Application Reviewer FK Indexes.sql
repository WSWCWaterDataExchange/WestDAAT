CREATE INDEX IX_WaterConservationApplicationSubmissions_RecommendedByUserId
    ON dbo.WaterConservationApplicationSubmissions (RecommendedByUserId)
    WHERE RecommendedByUserId IS NOT NULL;

CREATE INDEX IX_WaterConservationApplicationSubmissions_ApprovedByUserId
    ON dbo.WaterConservationApplicationSubmissions (ApprovedByUserId)
    WHERE ApprovedByUserId IS NOT NULL;

GO