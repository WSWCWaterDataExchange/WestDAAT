# WaDE

## Getting Started

1. Clone this repo.
2. Make sure you have the .NET 6 SDK installed.
3. Start SQL Server (Docker or Host machine)
   - If you already have a SQL Server container running, just use that as the Host machine no need for docker. 
   - To spin up a new SQL server docker container:
      - `docker compose` file supplied in `src/API/BackendServices/WesternStatesWater.WaDE.Docker/docker-compose.dev.yml`
      - `docker compose up -d`
4. Run DbUp project from WaDE2 repo 
   - **Note: No need to run DbUp if you imported bacpac files for the DBs** 
   - **Need two databases WaDE2 and WaDE2Test**
      - WaDE2Test is for the unit tests
   - If not using the default SQL server, update the connection string in launchSettings.json in the DbUp project
   - May need to run this twice if using docker
5. Setup Function App
   - Open Solution: path to file WestDAAT\src\API\WesternStatesWater.WestDaat.sln
   - Right-click on **Client.Functions** project and choose **Set as Startup Project**
   - create `local.settings.json` file in the **Client.Functions** project
   - If necessary, create personal.settings.json to override any developer specific settings. As an example( e.g. Insert: {“Database”:{“ConnectionString”: “Server = ‘Insert server name here’ ; Initial Catalog = ‘Insert local db name here’ ; Integrated Security = true;”}}) However this may vary. 
   - Set the listening port to 5001
      - Right-click on **Client.Functions** project
      - Choose Properties
      - Select Debug -> General -> Open debug launch profiles UI
      - In the command line arguments enter the following
         - `host start --port 5001`
      - Run the Function App
6. Setup React App
   - install NPM packages.
      - From the DashboardUI directory: `npm install`
   - Requires Node version 16+
   - Requires NPM version 8+
      - For Windows download the Node installer here: https://nodejs.org/en/download/
         - this installer includes NPM update
7. Update React App [.env](./src/DashboardUI/.env)
   - Set query string `key` value on the Vector Tile URLs. Talk to the project administrator about obtaining this key.
8. Start React App
   - From the DashboardUI directory: `npm run start`
   

## CORS errors
  - CORS configuration is set in the `local.settings.json` file of the function app


## Update Mapbox Vector Tileset

**Only do this if you need to update the vector tiles in maptiler**

1. Run MapboxTilesetCreate console app located in /tools
2. Optional - Add personal.settings.json for connection string settings
3. Allocations.Points.geojson and Allocations.Polygons.geojson, Overlays.Polygons.geojson, and TimeSeries.Points.geojson files will be generated in geojson dir
4. Run `tippecanoe -zg -o waterRights.mbtiles --read-parallel --drop-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L points:"Allocations.Points.geojson" -L polygons:"Allocations.Polygons.geojson"` to generate Water Right Map Tiles. This will take about 5 minutes
5. Run `tippecanoe -zg -o overlays.mbtiles --read-parallel --drop-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L polygons:"Overlays.Polygons.geojson"` to generate Overlay Map Tiles. This will take about 5 minutes
6. Run `tippecanoe -zg -o timeSeries.mbtiles --read-parallel --drop-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L points:"TimeSeries.Points.geojson"` to generate Time Series Map Tiles. This will take about 5 minutes
7. Upload to mapbox studio


## Deployment
- Setting secrets for deployment: https://github.com/Azure/actions-workflow-samples/blob/master/assets/create-secrets-for-GitHub-workflows.md
- To set secret with Azure Credientials, there should already be app registrations for the github actions, so just need to renew secret and put the new secret in the json (need at least Application Administrator role)

## OpenET Integration
- The OpenET SDK requires an api key to function. For local development, you will want to use the Dev api key.
- The api keys are listed on the OpenET website: https://account.etdata.org/settings/api
