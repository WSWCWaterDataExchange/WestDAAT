ALTER TABLE UserRoles
ADD UserId UNIQUEIDENTIFIER NOT NULL;

ALTER TABLE UserRoles
ADD CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(Id);

CREATE INDEX IX_UserRoles_UserId ON UserRoles(UserId);