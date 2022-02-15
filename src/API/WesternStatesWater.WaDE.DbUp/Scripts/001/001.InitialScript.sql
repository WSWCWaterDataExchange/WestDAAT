CREATE TABLE [dbo].[Todos]
(
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Message] [nvarchar](250) NOT NULL,
	[CreatedDate] [datetimeoffset](7) NOT NULL
)

ALTER TABLE [dbo].[Todos] ADD  DEFAULT (sysdatetimeoffset()) FOR [CreatedDate]

INSERT INTO [dbo].[Todos] (Message)
VALUES ('Take out trash'),
       ('Walk the dog'),
	   ('Do dishes'),
	   ('Pay bills')
