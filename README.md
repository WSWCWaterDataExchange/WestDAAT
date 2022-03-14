# WaDE

## Getting Started

1. Clone this repo.
2. Make sure you have the .NET 6 SDK installed.
3. Start SQL Server (Docker or Host machine)
   - `docker-compose` file supplied in `src/API/BackendServices/WesternStatesWater.WaDE.Docker/docker-compose.dev.yml`
4. Run DbUp project
   - May need to run this twice if using docker
5. Start Web (Backend WebApi)
6. Start React App
   - Requires Node version 16+


## Update Mapbox Vector Tileset

1. Run Function App
2. POST to http://localhost:7071/api/GenerateAllocationGeoJson
3. A .geojson file will be in the Function bin/output directory of the function app
4. Run `tippecanoe -zg -o out1.mbtiles --read-parallel --coalesce-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L allocations:"Allocations.geojson"`
5. Upload to mapbox studio

