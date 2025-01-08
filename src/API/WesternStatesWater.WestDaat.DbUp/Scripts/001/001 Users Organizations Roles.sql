CREATE TABLE Organizations
(
    Id   UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Organizations_Id PRIMARY KEY NONCLUSTERED,
    Name NVARCHAR(255)    NOT NULL
);

CREATE TABLE Users
(
    Id             UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users_Id PRIMARY KEY NONCLUSTERED,
    Email          NVARCHAR(255)    NOT NULL,
    ExternalAuthId NVARCHAR(255)    NOT NULL,
    CreatedAt      DATETIMEOFFSET   NOT NULL,
);

CREATE TABLE UserOrganizations
(
    Id             UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_UserOrganizations_Id PRIMARY KEY NONCLUSTERED,
    UserId         UNIQUEIDENTIFIER NOT NULL,
    OrganizationId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Users FOREIGN KEY (UserId) REFERENCES Users (Id),
    CONSTRAINT FK_Organizations FOREIGN KEY (OrganizationId) REFERENCES Organizations (Id)
);

CREATE INDEX IX_UserOrganizations_UserId ON UserOrganizations(UserId);
CREATE INDEX IX_UserOrganizations_OrganizationId ON UserOrganizations(OrganizationId);

CREATE TABLE UserOrganizationRoles
(
    Id                 UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_UserOrganizationRoles_Id PRIMARY KEY NONCLUSTERED,
    UserOrganizationId UNIQUEIDENTIFIER NOT NULL,
    Role               NVARCHAR(255)    NOT NULL,
    CONSTRAINT FK_UserOrganizations FOREIGN KEY (UserOrganizationId) REFERENCES UserOrganizations (Id)
);

CREATE INDEX IX_UserOrganizationRoles_UserOrganizationId ON UserOrganizationRoles(UserOrganizationId);