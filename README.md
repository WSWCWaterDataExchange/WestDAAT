# WaDE

## Getting Started

1. Clone this repo.
2. Make sure you have the .NET 6 SDK installed.
3. Start SQL Server (Docker or Host machine)
   - If you already have a SQL Server container running, just use that
   - To spin up a new SQL server docker container:
      - `docker-compose` file supplied in `src/API/BackendServices/WesternStatesWater.WaDE.Docker/docker-compose.dev.yml`
      - `docker-compose up -d`
4. Run DbUp project from WaDE2 repo 
   - **Note: No need to run DbUp if you imported bacpac files for the DBs** 
   - **Need two databases WaDE2 and WaDE2Test**
      - WaDE2Test is for the unit tests
   - If not using the default SQL server, update the connection string in launchSettings.json in the DbUp project
   - May need to run this twice if using docker
5. Setup Function App
   - Right-click on **Client.Functions** project and choose **Set as Startup Project**
   - create `local.settings.json` file in the **Client.Functions** project
   - If necessary, create `personal.settings.json` to override any developer specific settings
   - Set the listening port to 5001
      - Right-click on **Client.Functions** project
      - Choose Properties
      - Select Debug -> General -> Open debug launch profiles UI
      - In the command line arguments enter the following
         - `host start --port 5001`
      - Run the Function App
6. Setup React App
   - install NPM packages.
      - From the DashboardUI directory `npm install`
   - Requires Node version 16+
   - Requires NPM version 8+
      - For Windows download the Node installer here: https://nodejs.org/en/download/
         - this installer includes NPM update
   - Start React App
     - `npm run start`
   

## CORS errors
  - CORS configuration is set in the `local.settings.json` file of the function app


## Update Mapbox Vector Tileset

**Only do this if you need to update the vector tiles in maptiler**

1. Run MapboxTilesetCreate console app located in /tools
2. Optional - Add personal.settings.json for connection string settings
3. Allocations.Points.geojson and Allocations.Polygons.geojson files will be generated in geojson dir
4. Run `tippecanoe -zg -o waterRights.mbtiles --read-parallel --drop-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L points:"Allocations.Points.geojson" -L polygons:"Allocations.Polygons.geojson"` This will take about 5 minutes
5. Upload to mapbox studio
