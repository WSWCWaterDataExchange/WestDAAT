This project is for adding jsonld information into blobStorage as Json

to run this project you need:

1. update local.settings.json with connection strings for the database and the blobStorage
	a. if you do not wish to modify what is on the local.settings.json you can create a personal.settings.json file and set
		the connection strings, you will also need to change the project build to include this as is currently set as never
2. make sure your db connection string include MultipleActiveResultSets=True;

2. Generate Dockerfile by rightclicking the project > add > dockersupport... and select linux
3. Verify Dockerfile has all the paths correctly set
4. publish project to existing ContainerRegistry in azure portal, (you will need to have access to the azure portal from your account)
