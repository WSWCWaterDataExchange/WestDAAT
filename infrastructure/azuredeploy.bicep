@description('Specifies the location for resources.')
param location string = 'westus'

@description('Product name. (Example \'tenzing\')')
param Product string = 'WestDAAT'

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
      numberOfWorkers: 1
      acrUseManagedIdentityCreds: false
      alwaysOn: false
      http20Enabled: false
      functionAppScaleLimit: 200
      minimumElasticInstanceCount: 0
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
    siteName: 'wade-westdaat-qa-fn'
    hostNameType: 'Verified'
  }
}
