@description('Specifies the location for resources.')
param location string = 'westus'

@description('Org name. Example (\'dpl\')')
param Organization string

@description('Product name. (Example \'tenzing\')')
param Product string

@description('Used to determine naming convention for resources')
@allowed([
  'dev'
  'qa'
  'staging'
  'prod'
])
param Environment string

@description('Connection string name as found in appsettings.json (Example: \'DPLDatabase\')')
param sql_server_connection_name string

@description('Initial database password. User defaults to server name. This password is required for server creation, but is not used otherwise')
@secure()
param sql_server_sa_password string

var resource_name_dashes_var = '${toLower(Organization)}-${toLower(Product)}-${toLower(Environment)}'
var resource_name_var = '${toLower(Organization)}${toLower(Product)}${toLower(Environment)}'
var serverfarms_name_var = 'ASP-${resource_name_var}-b115'

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

resource Microsoft_Sql_servers_resource_name_dashes 'Microsoft.Sql/servers@2019-06-01-preview' = {
  name: resource_name_dashes_var
  location: location
  kind: 'v12.0'
  properties: {
    administratorLogin: resource_name_dashes_var
    administratorLoginPassword: sql_server_sa_password
    version: '12.0'
    publicNetworkAccess: 'Enabled'
  }
}

resource Microsoft_Storage_storageAccounts_resource_name 'Microsoft.Storage/storageAccounts@2020-08-01-preview' = {
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

resource serverfarms_name 'Microsoft.Web/serverfarms@2018-02-01' = {
  name: serverfarms_name_var
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
    size: 'F1'
    family: 'F'
    capacity: 0
  }
  kind: 'app'
  properties: {
    perSiteScaling: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: false
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
  }
}

resource resource_name_resource_name 'Microsoft.Cdn/profiles/endpoints@2020-04-15' = {
  parent: resource_name
  name: resource_name_var
  location: 'Global'
  properties: {
    originHostHeader: '${resource_name_var}.z19.web.core.windows.net'
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
          hostName: '${resource_name_var}.z19.web.core.windows.net'
          enabled: true
        }
      }
    ]
    originGroups: []
    geoFilters: []
    urlSigningKeys: []
  }
}

resource resource_name_dashes_CreateIndex 'Microsoft.Sql/servers/advisors@2014-04-01' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'CreateIndex'
  properties: {
    autoExecuteValue: 'Disabled'
  }
}

resource resource_name_dashes_DropIndex 'Microsoft.Sql/servers/advisors@2014-04-01' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'DropIndex'
  properties: {
    autoExecuteValue: 'Disabled'
  }
}

resource resource_name_dashes_ForceLastGoodPlan 'Microsoft.Sql/servers/advisors@2014-04-01' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'ForceLastGoodPlan'
  properties: {
    autoExecuteValue: 'Enabled'
  }
}

resource resource_name_dashes_Default 'Microsoft.Sql/servers/auditingPolicies@2014-04-01' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'default'
  location: location
  properties: {
    auditingState: 'Disabled'
  }
}

resource Microsoft_Sql_servers_auditingSettings_resource_name_dashes_Default 'Microsoft.Sql/servers/auditingSettings@2017-03-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'default'
  properties: {
    retentionDays: 0
    auditActionsAndGroups: []
    isStorageSecondaryKeyInUse: false
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
}

resource resource_name_dashes_resource_name_dashes 'Microsoft.Sql/servers/databases@2020-08-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: resource_name_dashes_var
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  kind: 'v12.0,user'
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
    storageAccountType: 'GRS'
    maintenanceConfigurationId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_Default'
  }
}

resource resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/auditingPolicies@2014-04-01' = {
  name: '${resource_name_dashes_var}/master/Default'
  location: location
  properties: {
    auditingState: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_auditingSettings_resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/auditingSettings@2017-03-01-preview' = {
  name: '${resource_name_dashes_var}/master/Default'
  properties: {
    retentionDays: 0
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_extendedAuditingSettings_resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/extendedAuditingSettings@2017-03-01-preview' = {
  name: '${resource_name_dashes_var}/master/Default'
  properties: {
    retentionDays: 0
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_geoBackupPolicies_resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/geoBackupPolicies@2014-04-01' = {
  name: '${resource_name_dashes_var}/master/Default'
  location: location
  properties: {
    state: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_securityAlertPolicies_resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/securityAlertPolicies@2020-02-02-preview' = {
  name: '${resource_name_dashes_var}/master/Default'
  properties: {
    state: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_master_current 'Microsoft.Sql/servers/databases/transparentDataEncryption@2014-04-01' = {
  name: '${resource_name_dashes_var}/master/current'
  location: location
  properties: {
    status: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_vulnerabilityAssessments_resource_name_dashes_master_Default 'Microsoft.Sql/servers/databases/vulnerabilityAssessments@2017-03-01-preview' = {
  name: '${resource_name_dashes_var}/master/Default'
  properties: {
    recurringScans: {
      isEnabled: false
      emailSubscriptionAdmins: true
    }
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_current 'Microsoft.Sql/servers/encryptionProtector@2015-05-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'current'
  kind: 'servicemanaged'
  properties: {
    serverKeyName: 'ServiceManaged'
    serverKeyType: 'ServiceManaged'
  }
}

resource Microsoft_Sql_servers_extendedAuditingSettings_resource_name_dashes_Default 'Microsoft.Sql/servers/extendedAuditingSettings@2017-03-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'default'
  properties: {
    retentionDays: 0
    auditActionsAndGroups: []
    isStorageSecondaryKeyInUse: false
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
}

resource resource_name_dashes_AllowAllWindowsAzureIps 'Microsoft.Sql/servers/firewallRules@2015-05-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource resource_name_dashes_ServiceManaged 'Microsoft.Sql/servers/keys@2015-05-01-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'ServiceManaged'
  kind: 'servicemanaged'
  properties: {
    serverKeyType: 'ServiceManaged'
  }
}

resource Microsoft_Sql_servers_securityAlertPolicies_resource_name_dashes_Default 'Microsoft.Sql/servers/securityAlertPolicies@2020-02-02-preview' = {
  parent: Microsoft_Sql_servers_resource_name_dashes
  name: 'Default'
  properties: {
    state: 'Disabled'
  }
}

resource resource_name_default 'Microsoft.Storage/storageAccounts/blobServices@2020-08-01-preview' = {
  parent: Microsoft_Storage_storageAccounts_resource_name
  name: 'default'
  sku: {
    name: 'Standard_RAGRS'
    tier: 'Standard'
  }
  properties: {
    cors: {
      corsRules: []
    }
    deleteRetentionPolicy: {
      enabled: false
    }
  }
}

resource Microsoft_Storage_storageAccounts_queueServices_resource_name_default 'Microsoft.Storage/storageAccounts/queueServices@2020-08-01-preview' = {
  parent: Microsoft_Storage_storageAccounts_resource_name
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource Microsoft_Storage_storageAccounts_tableServices_resource_name_default 'Microsoft.Storage/storageAccounts/tableServices@2020-08-01-preview' = {
  parent: Microsoft_Storage_storageAccounts_resource_name
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource Microsoft_Web_sites_resource_name_dashes 'Microsoft.Web/sites@2018-11-01' = {
  name: '${resource_name_dashes_var}-fn'
  kind: 'functionapp'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    name: '${resource_name_dashes_var}-fn'
    siteConfig: {
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference(resource_name_dashes.id, '2020-02-02-preview').ConnectionString
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'AzureWebJobsSecretStorageType'
          value: 'files'
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${resource_name_var};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(Microsoft_Storage_storageAccounts_resource_name.id, '2019-06-01').keys[0].value}'
        }
        {
          name: 'AppSettings:AccessTokenDatabaseTenantId'
          value: subscription().tenantId
        }
        {
          name: 'AppSettings:AccessTokenDatabaseResource'
          value: 'https://database.windows.net/'
        }
      ]
      connectionStrings: [
        {
          name: sql_server_connection_name
          connectionString: 'Server=tcp:${resource_name_dashes_var}.database.windows.net,1433;Initial Catalog=${resource_name_dashes_var};Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
          type: 'SQLServer'
        }
      ]
    }
    serverFarmId: serverfarms_name.id
    clientAffinityEnabled: false
  }
}

resource resource_name_dashes_fn 'Microsoft.Web/sites@2018-11-01' = {
  name: resource_name_dashes_var
  location: location
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
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
    serverFarmId: serverfarms_name.id
    reserved: false
    isXenon: false
    hyperV: false
    siteConfig: {
      appSettings: [
        {
          name: 'AppSettings:AccessTokenDatabaseTenantId'
          value: subscription().tenantId
        }
        {
          name: 'AppSettings:AccessTokenDatabaseResource'
          value: 'https://database.windows.net/'
        }
      ]
      connectionStrings: [
        {
          name: sql_server_connection_name
          connectionString: 'Server=tcp:${resource_name_dashes_var}.database.windows.net,1433;Initial Catalog=${resource_name_dashes_var};Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
          type: 'SQLServer'
        }
      ]
    }
    scmSiteAlsoStopped: false
    clientAffinityEnabled: true
    clientCertEnabled: false
    hostNamesDisabled: false
    containerSize: 0
    dailyMemoryTimeQuota: 0
    httpsOnly: false
    redundancyMode: 'None'
  }
}

resource resource_name_dashes_web 'Microsoft.Web/sites/config@2018-11-01' = {
  parent: Microsoft_Web_sites_resource_name_dashes
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
      'hostingstart.html'
    ]
    netFrameworkVersion: 'v5.0'
    requestTracingEnabled: false
    remoteDebuggingEnabled: false
    httpLoggingEnabled: false
    logsDirectorySizeLimit: 35
    detailedErrorLoggingEnabled: false
    publishingUsername: '$${resource_name_dashes_var}'
    azureStorageAccounts: {}
    scmType: 'VSTSRM'
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
    cors: {
      allowedOrigins: [
        'https://${resource_name_var}.azureedge.net'
      ]
      supportCredentials: true
    }
    localMySqlEnabled: false
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
    ftpsState: 'AllAllowed'
    reservedInstanceCount: 0
  }
}

resource resource_name_dashes_resource_name_dashes_azurewebsites_net 'Microsoft.Web/sites/hostNameBindings@2018-11-01' = {
  parent: Microsoft_Web_sites_resource_name_dashes
  name: '${resource_name_dashes_var}.azurewebsites.net'
  location: location
  properties: {
    siteName: resource_name_dashes_var
    hostNameType: 'Verified'
  }
}

resource resource_name_dashes_Microsoft_AspNetCore_AzureAppServices_SiteExtension 'Microsoft.Web/sites/siteextensions@2018-11-01' = {
  parent: Microsoft_Web_sites_resource_name_dashes
  name: 'Microsoft.AspNetCore.AzureAppServices.SiteExtension'
  location: location
}

resource resource_name_resource_name_resource_name_blob_core_windows_net 'Microsoft.Cdn/profiles/endpoints/origins@2020-04-15' = {
  parent: resource_name_resource_name
  name: '${resource_name_var}-blob-core-windows-net'
  properties: {
    hostName: '${resource_name_var}.z19.web.core.windows.net'
    enabled: true
  }
  dependsOn: [
    resource_name
  ]
}

resource resource_name_dashes_resource_name_dashes_CreateIndex 'Microsoft.Sql/servers/databases/advisors@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'CreateIndex'
  properties: {
    autoExecuteValue: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_resource_name_dashes_DefragmentIndex 'Microsoft.Sql/servers/databases/advisors@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'DefragmentIndex'
  properties: {
    autoExecuteValue: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_resource_name_dashes_DropIndex 'Microsoft.Sql/servers/databases/advisors@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'DropIndex'
  properties: {
    autoExecuteValue: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_resource_name_dashes_ForceLastGoodPlan 'Microsoft.Sql/servers/databases/advisors@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'ForceLastGoodPlan'
  properties: {
    autoExecuteValue: 'Enabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/auditingPolicies@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  location: location
  properties: {
    auditingState: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_auditingSettings_resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/auditingSettings@2017-03-01-preview' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  properties: {
    retentionDays: 0
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_backupShortTermRetentionPolicies_resource_name_dashes_resource_name_dashes_default 'Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies@2017-10-01-preview' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  properties: {
    retentionDays: 7
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_extendedAuditingSettings_resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/extendedAuditingSettings@2017-03-01-preview' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  properties: {
    retentionDays: 0
    isAzureMonitorTargetEnabled: false
    state: 'Disabled'
    storageAccountSubscriptionId: '00000000-0000-0000-0000-000000000000'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_geoBackupPolicies_resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/geoBackupPolicies@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'Default'
  location: location
  properties: {
    state: 'Enabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_securityAlertPolicies_resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/securityAlertPolicies@2020-02-02-preview' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  properties: {
    state: 'Disabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_dashes_resource_name_dashes_current 'Microsoft.Sql/servers/databases/transparentDataEncryption@2014-04-01' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'current'
  location: location
  properties: {
    status: 'Enabled'
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource Microsoft_Sql_servers_databases_vulnerabilityAssessments_resource_name_dashes_resource_name_dashes_Default 'Microsoft.Sql/servers/databases/vulnerabilityAssessments@2017-03-01-preview' = {
  parent: resource_name_dashes_resource_name_dashes
  name: 'default'
  properties: {
    recurringScans: {
      isEnabled: false
      emailSubscriptionAdmins: true
    }
  }
  dependsOn: [
    Microsoft_Sql_servers_resource_name_dashes
  ]
}

resource resource_name_default_web 'Microsoft.Storage/storageAccounts/blobServices/containers@2020-08-01-preview' = {
  parent: resource_name_default
  name: '$web'
  properties: {
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
  dependsOn: [
    Microsoft_Storage_storageAccounts_resource_name
  ]
}
