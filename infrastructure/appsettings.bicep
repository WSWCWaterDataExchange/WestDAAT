param fnName string
param currentAppSettings object 
param appSettings object

resource siteconfig 'Microsoft.Web/sites/config@2020-12-01' = {
  name: '${fnName}/appsettings'
  properties: union(currentAppSettings, appSettings)
}
