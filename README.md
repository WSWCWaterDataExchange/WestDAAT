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


## Azure Deployment

1. Use supplied `azuredeploy.json` ARM template located in the `infrastructure/`
2. Deploy resources using AzureCLI or Azure Portal
3. Detailed instructions can be found in [infrastructure/README.md](infrastructure/README.md)

## Azure DevOps Pipelines

1. Example pipelines can be found in `pipelines/`
2. Detailed instructions can be found in [pipelines/README.md](pipelines/README.md)
