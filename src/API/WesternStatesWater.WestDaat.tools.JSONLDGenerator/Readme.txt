This project is for adding jsonld information into blobStorage as Json

to run this project you need:

1. update local.settings.json with connection strings for the database and the blobStorage
	a. if you do not wish to modify what is on the local.settings.json you can create a personal.settings.json file and set
		the connection strings, you will also need to change the project build to include this as is currently set as never

2. Generate Dockerfile by rightclicking the project > add > dockersupport... and select linux
3. Verify Dockerfile has all the paths correctly set
4. Verify all your connection strings are correctly set
5. publish project to existing ContainerRegistry in azure portal, (you will need to have access to the azure portal from your account), in this case was publish from develop branch using QA connection strings.

to create the container instance you need to open the azure cli
run the following command to create a container instance
az container create --resource-group <YOUR_RESOURCE_NAME> --name <YOUR_CONTAINER_INSTANCE_TO_CREATE> --image <YOUR_CONTAINER_REGISTRY_IMAGE$INCLUDE FULL URL AND DOCKER TAG :latest or any given> --memory 4 --cpu 1 --restart-policy Never --location westus --os-type linux

to run on an schedule a logic App was created, using the UI
	a. logic app designer
		a.1 reocurrence step, set the trigger time
		a.2 selected task, start containers in a container group, use the RESOURCE_NAME and CONTAINER_INSTANCE_NAME
		a.3 hit save
