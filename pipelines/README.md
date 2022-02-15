# Azure DevOps CI + CD

### On Pull-request
Create two pipelines
 
 - `pr-angular.yml`
 - `pr-backend.yml`

### On Merge
Create two piplines *per* environment
- `on-merge-backend-develop.yml` (This deploys to QA)
- `on-merge-frontend-develop.yml` (This deploys to QA)
- `etc`

## Releases
Create two releases *per* environment
- These don't export cleanly in DevOps but here is the gist

**Backend:**
```
agent: windows-2019
artifactDownload: CD-Backend-Develop

variables:
  ConnectionStrings:YourDbConnectionNameHere: 'Server=tcp:dpl-owca-dev.database.windows.net,1433;Initial Catalog=dpl-owca-dev;'

steps:
- task: AzureRmWebAppDeployment@4
  displayName: 'Deploy Backend'
  inputs:
    azureSubscription: 'DPL-OWCA Azure Service Connection'
    WebAppName: 'dpl-owca-dev'
    packageForLinux: '$(System.DefaultWorkingDirectory)/CD-Backend-Develop/qa_dotnet_drop/Backend/Application'
 

steps:
- task: AzureCLI@2
  displayName: DbUp
  inputs:
    azureSubscription: 'DPL-OWCA Azure Service Connection'
    scriptType: batch
    scriptLocation: inlineScript
    inlineScript: 'dotnet WesternStatesWater.WaDE.DbUp.dll "$(ConnectionStrings:YourDbConnectionNameHere)"'
    workingDirectory: '$(System.DefaultWorkingDirectory)/CD-Backend-Develop/qa_dotnet_drop/DbUp/Application'
agent: vs2017-win2016
artifactDownload: CD-Frontend-Develop
```

**Frontend:**
```
steps:
- task: AzureFileCopy@2
  displayName: 'Copy Angular App Blob'
  inputs:
    SourcePath: '$(System.DefaultWorkingDirectory)/CD-Frontend-Develop/qa_ng_drop'
    azureSubscription: 'DPL-OWCA Azure Service Connection'
    Destination: AzureBlob
    storage: dplowcaqa
    ContainerName: '$web'
```


### Triggers and Branch Management

**`develop`  => QA Environment**
- On `develop` branch merge, this will trigger pipeline and generate artifacts
- Build artifacts will triggered QA Release

**`staging`  => Staging Environment**
- On `staging` branch merge, this will trigger pipeline and generate artifacts
- Build artifacts will triggered Staging Release

**`main`  => Production Environment**
- On `main` branch merge, this will trigger pipeline and generate artifacts
- Release is manual (aka no trigger)

