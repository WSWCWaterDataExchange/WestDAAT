var location = 'westus'
var Product = 'WestDAAT'

@description('Used to determine naming convention for resources')
@allowed([
  'dev'
  'qa'
  'staging'
  'prod'
])
param Environment string

var resource_name_dashes_var = '${toLower(Product)}-${toLower(Environment)}'
var resource_name_var = '${toLower(Product)}${toLower(Environment)}'
var serverfarms_ASP_name = 'ASP-${Product}-${toUpper(Environment)}'


var wadeDatabaseServer = {
  qa: 'wade-qa-server.database.windows.net'
  staging: 'wade-production-server.database.windows.net' // yes, prod
  prod: 'wade-production-server.database.windows.net'
}

var wadeDatabaseName = {
  qa: 'WaDE_QA'
  staging: 'wade_uat'
  prod: 'wade_prod'
}

var westdaatdbname = 'WestDAAT'

var b2cOrigins = {
  qa: 'https://westdaatqa.b2clogin.com'
  staging: 'https://westdaatstaging.b2clogin.com'
  prod: 'https://westdaat.b2clogin.com'
}

var siteOrigins = {
  qa: 'https://westdaatqa.westernstateswater.org'
  staging: 'https://westdaatstaging.westernstateswater.org'
  prod: 'https://westdaat.westernstateswater.org'
}

// Role Definitions (Different per tenant). 
// Can be found via IAM -> Role Assignment -> Search -> View Details -> JSON (guid is in id)
var azureServiceBusDataSenderRoleDefinitionName = '69a216fc-b8fb-44d8-bc22-1f3c2cd27a39'
var azureServiceBusReceiverRoleDefinitionName = '4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0'
var azureStorageBlobDataContributorRoleDefinitionName = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'

var activeDirectoryObjectIds = {
  qa: ['5c18b0c3-d95d-4720-86f6-f292f2e3c243', 'WestDAAT - QA - Access']
  staging: ['e4ca42c0-cfc7-4d1b-865f-e0ad5b136601', 'WestDAAT - Staging - Access']
  prod: ['e90fc2e6-524a-4de2-bdce-82272c852c00', 'WestDAAT - Prod - Access']
}

resource resource_name 'Microsoft.Cdn/profiles@2020-04-15' = {
  name: resource_name_var
  location: 'Global'
  sku: {
    name: 'Standard_Microsoft'
  }
  kind: 'cdn'
  properties: {}
}

resource Application_Insights_Smart_Detection 'microsoft.insights/actionGroups@2019-03-01' = {
  name: 'Application Insights Smart Detection'
  location: 'Global'
  properties: {
    groupShortName: 'SmartDetect'
    enabled: true
    emailReceivers: []
    smsReceivers: []
    webhookReceivers: []
    itsmReceivers: []
    azureAppPushReceivers: []
    automationRunbookReceivers: []
    voiceReceivers: []
    logicAppReceivers: []
    azureFunctionReceivers: []
  }
}

resource resource_name_dashes 'microsoft.insights/components@2018-05-01-preview' = {
  name: resource_name_dashes_var
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Redfield'
    Request_Source: 'IbizaWebAppExtensionCreate'
    RetentionInDays: 90
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource Microsoft_Storage_storageAccounts 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: resource_name_var
  location: location
  sku: {
    name: 'Standard_RAGRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource storage_account_blob 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: Microsoft_Storage_storageAccounts
  name: 'default'
  properties: {
    cors: {
      corsRules: [
        {
          allowedHeaders: [
            '*'
          ]
          allowedMethods: [
            'GET'
            'POST'
            'PUT'
            'OPTIONS'
            'HEAD'
          ]
          allowedOrigins: [
            b2cOrigins[Environment]
            siteOrigins[Environment]
          ]
          exposedHeaders: [
            '*'
          ]
          maxAgeInSeconds: 600
        }
      ]
    }
    deleteRetentionPolicy: {
      enabled: true
      days: 365
    }
    isVersioningEnabled: true
  }
}

// List of containers to create
var containers = [
  'application-documents'
]

resource storage_account_containers 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [
  for container in containers: {
    parent: storage_account_blob
    name: container
  }
]

resource resource_name_resource_name 'Microsoft.Cdn/profiles/endpoints@2020-04-15' = {
  parent: resource_name
  name: resource_name_var
  location: 'Global'
  properties: {
    originHostHeader: '${resource_name_var}.z22.web.core.windows.net'
    contentTypesToCompress: [
      'text/plain'
      'text/html'
      'text/css'
      'text/javascript'
      'application/x-javascript'
      'application/javascript'
      'application/json'
      'application/xml'
    ]
    isCompressionEnabled: true
    isHttpAllowed: true
    isHttpsAllowed: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    origins: [
      {
        name: '${resource_name_var}-blob-core-windows-net'
        properties: {
          hostName: '${resource_name_var}.z22.web.core.windows.net'
          enabled: true
        }
      }
    ]
    originGroups: []
    geoFilters: []
    urlSigningKeys: []
  }
}

resource Microsoft_Storage_storageAccounts_queueServices_resource_name_default 'Microsoft.Storage/storageAccounts/queueServices@2020-08-01-preview' = {
  parent: Microsoft_Storage_storageAccounts
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource Microsoft_Storage_storageAccounts_tableServices_resource_name_default 'Microsoft.Storage/storageAccounts/tableServices@2020-08-01-preview' = {
  parent: Microsoft_Storage_storageAccounts
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource resource_name_resource_name_resource_name_blob_core_windows_net 'Microsoft.Cdn/profiles/endpoints/origins@2020-04-15' = {
  parent: resource_name_resource_name
  name: '${resource_name_var}-blob-core-windows-net'
  properties: {
    hostName: '${resource_name_var}.z22.web.core.windows.net'
    enabled: true
  }
  dependsOn: [
    resource_name
  ]
}

resource serverfarms_ASP_resource 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: serverfarms_ASP_name
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0
  }
  kind: 'functionapp'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: false
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}

resource sites_fn_resource 'Microsoft.Web/sites@2021-03-01' = {
  name: resource_name_dashes_var
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    Microsoft_Storage_storageAccounts
  ]
  properties: {
    enabled: true
    hostNameSslStates: [
      {
        name: '${resource_name_dashes_var}.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Standard'
      }
      {
        name: '${resource_name_dashes_var}.scm.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Repository'
      }
    ]
    serverFarmId: serverfarms_ASP_resource.id
    reserved: false
    isXenon: false
    hyperV: false
    siteConfig: {
      // Don't include the appSettings here. They will get merged in separate step
      // Doing so will clobber existing app settings
    }
    scmSiteAlsoStopped: false
    clientAffinityEnabled: false
    clientCertEnabled: false
    clientCertMode: 'Required'
    hostNamesDisabled: false
    customDomainVerificationId: '75389B719DA59678F1098C249250F0B8A809C221B35834D21FAC4A6DBC83D421'
    containerSize: 1536
    dailyMemoryTimeQuota: 0
    httpsOnly: false
    redundancyMode: 'None'
    storageAccountRequired: false
    keyVaultReferenceIdentity: 'SystemAssigned'
  }
}

var fnAppSettings = {
  'BlobStorage:Uri': 'https://${Microsoft_Storage_storageAccounts.name}.blob.${environment().suffixes.storage}'
  'Database:AccessTokenDatabaseResource': 'https://database.windows.net/'
  'Database:AccessTokenDatabaseTenantId': subscription().tenantId
  'Database:WadeConnectionString': 'Server=tcp:${wadeDatabaseServer[Environment]},1433;Initial Catalog=${wadeDatabaseName[Environment]};Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
  'Database:WestDaatConnectionString': 'Server=tcp:${sql_server.name}${environment().suffixes.sqlServerHostname},1433;Initial Catalog=${sql_server_database.name};Application Name=${sites_fn_resource.name};Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;Column Encryption Setting=enabled;TrustServerCertificate=False;Connection Timeout=30;'
  'Environment:IsDevelopment': false
  'MessageBus:ServiceBusUrl': '${service_bus.name}.servicebus.windows.net'
  'Nldi:MaxDownstreamDiversionDistance': '500'
  'Nldi:MaxDownstreamMainDistance': '500'
  'Nldi:MaxUpstreamMainDistance': '500'
  'Nldi:MaxUpstreamTributaryDistance': '500'
  'Smtp:FeedbackFrom': 'no-reply@westernstateswater.org'
  'Smtp:FeedbackTo:0': 'WaDE_WSWC@hotmail.com'
  'Smtp:FeedbackTo:1': 'rjames@wswc.utah.gov'
  'Smtp:NotificationFrom': 'no-reply@westernstateswater.org'
  'Smtp:NotificationFromName': 'WestDAAT'
  APPLICATIONINSIGHTS_CONNECTION_STRING: reference(resource_name_dashes.id, '2020-02-02-preview').ConnectionString
  AzureWebJobsSecretStorageType: 'files'
  AzureWebJobsStorage: 'DefaultEndpointsProtocol=https;AccountName=${resource_name_var};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(Microsoft_Storage_storageAccounts.id, '2019-06-01').keys[0].value}'
  FUNCTIONS_EXTENSION_VERSION: '~4'
  FUNCTIONS_WORKER_RUNTIME: 'dotnet-isolated'
  ServiceBusConnection__fullyQualifiedNamespace: '${service_bus.name}.servicebus.windows.net'
  WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: 'DefaultEndpointsProtocol=https;AccountName=${resource_name_var};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(Microsoft_Storage_storageAccounts.id, '2019-06-01').keys[0].value}'
  WEBSITE_CONTENTSHARE: 'westdaat-qa-1234'
}

module appSettings 'appsettings.bicep' = {
  name: 'functionAppSettings'
  params: {
    fnName: sites_fn_resource.name
    currentAppSettings: list('${sites_fn_resource.id}/config/appsettings', '2020-12-01').properties
    appSettings: fnAppSettings
  }
}

resource sites_fn_ftp 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2021-03-01' = {
  parent: sites_fn_resource
  name: 'ftp'
  location: location
  properties: {
    allow: true
  }
}

resource sites_fn_scm 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2021-03-01' = {
  parent: sites_fn_resource
  name: 'scm'
  location: location
  properties: {
    allow: true
  }
}

resource sites_fn_web 'Microsoft.Web/sites/config@2021-03-01' = {
  parent: sites_fn_resource
  name: 'web'
  location: location
  properties: {
    numberOfWorkers: 1
    defaultDocuments: [
      'Default.htm'
      'Default.html'
      'Default.asp'
      'index.htm'
      'index.html'
      'iisstart.htm'
      'default.aspx'
      'index.php'
    ]
    netFrameworkVersion: 'v6.0'
    requestTracingEnabled: false
    remoteDebuggingEnabled: false
    httpLoggingEnabled: false
    acrUseManagedIdentityCreds: false
    logsDirectorySizeLimit: 35
    detailedErrorLoggingEnabled: false
    publishingUsername: '$wade-westdaat-qa-fn'
    scmType: 'None'
    use32BitWorkerProcess: true
    webSocketsEnabled: false
    alwaysOn: false
    managedPipelineMode: 'Integrated'
    virtualApplications: [
      {
        virtualPath: '/'
        physicalPath: 'site\\wwwroot'
        preloadEnabled: false
      }
    ]
    loadBalancing: 'LeastRequests'
    experiments: {
      rampUpRules: []
    }
    autoHealEnabled: false
    vnetRouteAllEnabled: false
    vnetPrivatePortsCount: 0
    cors: {
      allowedOrigins: [
        'https://portal.azure.com'
        'https://westdaatqa.azureedge.net'
        'https://westdaatqa.westernstateswater.org'
      ]
      supportCredentials: false
    }
    localMySqlEnabled: false
    managedServiceIdentityId: 14903
    ipSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictionsUseMain: false
    http20Enabled: false
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.0'
    ftpsState: 'AllAllowed'
    preWarmedInstanceCount: 0
    functionAppScaleLimit: 200
    functionsRuntimeScaleMonitoringEnabled: false
    minimumElasticInstanceCount: 0
    azureStorageAccounts: {}
  }
}

resource sites_fn_sites_azurewebsites_net 'Microsoft.Web/sites/hostNameBindings@2021-03-01' = {
  parent: sites_fn_resource
  name: '${resource_name_dashes_var}.azurewebsites.net'
  location: location
  properties: {
    hostNameType: 'Verified'
  }
}

resource api_management 'Microsoft.ApiManagement/service@2024-05-01' = {
  name: resource_name_var
  location: location
  sku: {
    name: 'Consumption'
    capacity: 0
  }
  properties: {
    publisherEmail: 'rjames@wswc.utah.gov'
    publisherName: 'Western States Water Council'
  }
}

var sqlAdminActiveDirectoryObject = activeDirectoryObjectIds[Environment]

resource sql_server 'Microsoft.Sql/servers@2021-11-01' = {
  name: resource_name_dashes_var
  location: location
  properties: {
    version: '12.0'
    publicNetworkAccess: 'Enabled'
    administrators: {
      administratorType: 'ActiveDirectory'
      azureADOnlyAuthentication: true
      sid: sqlAdminActiveDirectoryObject[0]
      login: sqlAdminActiveDirectoryObject[1]
      principalType: 'Group'
      tenantId: tenant().tenantId
    }
  }
}

resource sql_server_database 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sql_server
  name: westdaatdbname
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
  }
}

resource allowAccessToAzureServices 'Microsoft.Sql/servers/firewallRules@2021-11-01' = {
  parent: sql_server
  name: 'allow-access-to-azure-services'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource service_bus 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: resource_name_dashes_var
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    disableLocalAuth: false
    zoneRedundant: false
    minimumTlsVersion: '1.2'
  }
}

// Will need to match the following locations:
//   AzureNames.Queues list
//   sb-emulator.config.json
var queueNames = [
  'conservation-application-submitted'
]

resource sbQueues 'Microsoft.ServiceBus/namespaces/queues@2021-06-01-preview' = [
  for queueName in queueNames: {
    parent: service_bus
    name: queueName
  }
]

// Role Assignments
// Note - You must be an Owner or User Access Administrator to assign roles.

resource azureServiceBusDataSenderRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: azureServiceBusDataSenderRoleDefinitionName
}

resource serviceBusRoleAssignmentFnAppSender 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: service_bus
  name: guid('${service_bus.id}-send')
  properties: {
    principalId: sites_fn_resource.identity.principalId
    roleDefinitionId: azureServiceBusDataSenderRoleDefinition.id
    principalType: 'ServicePrincipal'
  }
}

resource azureServiceBusReceiverRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: azureServiceBusReceiverRoleDefinitionName
}

resource serviceBusRoleAssignmentFnAppReceiver 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: service_bus
  name: guid('${service_bus.id}-receive')
  properties: {
    principalId: sites_fn_resource.identity.principalId
    roleDefinitionId: azureServiceBusReceiverRoleDefinition.id
    principalType: 'ServicePrincipal'
  }
}

resource azureStorageBlobDataContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: azureStorageBlobDataContributorRoleDefinitionName
}

resource storageAccountRoleAssignmentFnApp 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: Microsoft_Storage_storageAccounts
  name: guid('${Microsoft_Storage_storageAccounts.id}-data-contributor')
  properties: {
    principalId: sites_fn_resource.identity.principalId
    roleDefinitionId: azureStorageBlobDataContributorRoleDefinition.id
    principalType: 'ServicePrincipal'
  }
}
