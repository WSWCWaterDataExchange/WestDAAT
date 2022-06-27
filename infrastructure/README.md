# Azure Resources Deployment Steps

### Login + Select Subscription
```
az login
az account list --output table
az account set --subscription "Your subscription name"
```


### Create resource group (skip if using existing)
```
az group create -l centralus -n <YOUR-RESOURCE-GROUP>
```
 

### Create azure deployment
```
az deployment group create --name AzureDeploy --resource-group <resource-group-name> --template-file azuredeploy.bicep
```


#### Example values

```
> Please provide string value for 'Organization' (? for help): dpl
> Please provide string value for 'Product' (? for help): owca
> Please provide string value for 'Environment' (? for help): 
>  [1] dev
>  [2] qa
>  [3] staging
>  [4] prod
> Please enter a choice [Default choice(1)]: 1
> Running... 
```

> &nbsp;
> **Note - this will take a few minutes**
> &nbsp;


### Enable Static website via azure cli
```
az storage account list --output table
az storage blob service-properties update --account-name <account-name> --static-website --404-document index.html --index-document index.html
```


### Gotchas

> &nbsp;
> **Note - You'll need to restart any app using to connect to the DB if any permission changes are made. This is because the access tokens are cached by the client (App Service / SQL Client / Etc)**
> &nbsp;


