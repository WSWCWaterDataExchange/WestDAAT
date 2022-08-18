INSERT INTO #TempId(Id)
SELECT S.SiteId
FROM Core.Sites_Dim s INNER JOIN
#TempUuid t ON s.SiteUuid = t.Uuid