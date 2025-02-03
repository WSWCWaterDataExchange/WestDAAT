# Infrastructure REAMDE

## Azure Resources Deployment Steps

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


## B2C Custom Login Page

Files prefixed with `b2c_` are used for custom B2C login pages. These are hosted in the `$web` container in a `b2c` folder. These files are publicly accessible and are used to customize the login experience for the user. The CDN endpoint is used to serve these files.

### To update the B2C custom login page
1. Locate the `b2c_signup_signin.html` file in the `infrastructure` folder
1. Update the file and replace the `<Environment>` with the appropriate environment name (qa, staging, prod, etc)
    - Note - Do not check in these changes to the repository
1. Upload the files to the `$web` container in the `b2c` folder


To learn more about customizing the B2C login page, visit the [Azure B2C UI Customization](https://learn.microsoft.com/en-us/azure/active-directory-b2c/customize-ui-with-html?pivots=b2c-user-flow) documentation.
