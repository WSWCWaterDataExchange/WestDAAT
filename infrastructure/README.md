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
az deployment group create --name AzureDeploy --resource-group <resource-group-name> --template-file <path-to-azuredeploy.json>
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
> Please provide string value for 'sql_server_connection_name' (? for help): MyDbConnectionName
> Please provide securestring value for 'sql_server_sa_password' (? for help): **********************
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


### Create Azure AD Group + Member Assignment     

Create SQL Admins group (keep the objectId value handy for next step) 
```
az ad group create --display-name DPL-OWCA-SQL-Admins --mail-nickname DPL-OWCA-SQL-Admins
```


Fetch member-id from app service identity 
```
az webapp identity show --resource-group DPL-OWCA-DEV --name dpl-owca-dev --query principalId
```

Add webapp identity to group
```
az ad group member add --group <group-object-id> --member-id <principalId-of-webapp-identity>
```

Your service connection from DevOps will create an App Registration + Enterprise Application in Azure AD 
Find this ObjectId via Azure Portal 
 - Azure AD -> Enterprise Application -> Applicatoin Type: All Applications -> your devops application -> ObjectId field
```
az ad group member add --group <group-object-id> --member-id <enterprise-application-objectId>
```


### Set AD Admin on SQL Server to yourself
```
az ad user show --id <yourusername@dontpaniclabs.com> --query objectId
az sql server ad-admin create --resource-group <resource-group> --server-name <your-server-name> --display-name YourUserName --object-id <object id from prev command>
```
> &nbsp;
> Note - if your username is not found. You might need to use Azure Portal to assign SQL AD Admin
> &nbsp;



### Allow DPL IP Address to connect to SQL
Connect to DPL VPN if you're not on the network already
Allow IP from DPL Office. `173.244.141.139` is the IP of the office, this changes occasionally 
```
az sql server firewall-rule create -g <resource-group> -s <your-db-server> -n AllowDPLOffice --start-ip-address 173.244.141.139 --end-ip-address 173.244.141.139
```


### Sqlcmd

> &nbsp;
> Must run this part on **Windows** if choosing the CLI. You can use `SSMS` on Windows or `Azure Data Studio` on MacOS
> - You will need at least version `15.0.2000.5` of `sqlcmd`. To confirm run `sqlcmd -?`  
>   - Get latest version of sqlcmd (https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver15)
>
> sqlcmd for MacOS does not support Azure AD MFA Auth (this may change in the future)
> - https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools?view=sql-server-ver15#macos
 > - https://apple.stackexchange.com/a/406529/89323 
> &nbsp;


 ```
 sqlcmd -S <your-db-here>database.windows.net -d <database-name> -U <yourusername@dontpaniclabs.com> -G
 ```


### T-SQL for Creating AD Group as SQL User
```
CREATE USER [DPL-OWCA-SQL-Admins] FROM EXTERNAL PROVIDER
ALTER ROLE db_datareader ADD MEMBER [DPL-OWCA-SQL-Admins]
ALTER ROLE db_datawriter ADD MEMBER [DPL-OWCA-SQL-Admins]
ALTER ROLE db_ddladmin ADD MEMBER [DPL-OWCA-SQL-Admins]
GO
```


### Gotchas

> &nbsp;
> **Note - You'll need to restart any app using to connect to the DB if any permission changes are made. This is because the access tokens are cached by the client (App Service / SQL Client / Etc)**
> &nbsp;



### Setup Pipeline/Releases and deploy via Azure DevOps
- View [Pipelines/README.md](templates/dplsln/Pipelines/README.md) for more information
