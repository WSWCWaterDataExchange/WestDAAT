# WaDE

## Getting Started

1. Clone this repo.
2. Make sure you have the .NET 6 SDK installed.
3. Start SQL Server (Docker or Host machine)
   - `docker-compose` file supplied in `src/API/BackendServices/WesternStatesWater.WaDE.Docker/docker-compose.dev.yml`
4. Run DbUp project from WaDE2 repo
   - May need to run this twice if using docker
5. Start Function App
6. Start React App
   - Requires Node version 16+


## Update Mapbox Vector Tileset

1. Run MapboxTilesetCreate console app located in /tools
2. Optional - Add personal.settings.json for connection string settings
3. An Allocations.geojson file will be generated in geojson dir
4. Run `tippecanoe -zg -o out1.mbtiles --read-parallel --coalesce-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L allocations:"Allocations.geojson"` This will take about 5 minutes
5. Upload to mapbox studio



