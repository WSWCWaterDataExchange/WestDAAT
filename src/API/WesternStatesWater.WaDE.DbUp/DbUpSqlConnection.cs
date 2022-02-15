using DbUp;
using DbUp.SqlServer;
using System;
using System.Data.SqlClient;
using System.Reflection;
using WesternStatesWater.WaDE.Common;
using System.Threading;
using System.Linq;
using Microsoft.Azure.Services.AppAuthentication;
using DbUp.Engine.Transactions;
using System.Collections.Generic;
using DbUp.Support;
using WesternStatesWater.WaDE.Accessors.EntityFramework;

namespace WesternStatesWater.WaDE.DbUp
{
    public class DbUpSqlConnection : DatabaseConnectionManager
    {
        public DbUpSqlConnection(string connectionString) : base(new DelegateConnectionFactory((log, dbManager) =>
            {
                Console.WriteLine($"DbUpSqlConnection connectionString: {connectionString}");
                var conn = new SqlConnection(connectionString);

                if (DatabaseContext.ShouldUseAzureAccessTokenAuth())
                {
                    Console.WriteLine("Fetching access token...");
                    conn.AccessToken = DatabaseContext.GetAzureAccessToken();
                    Console.WriteLine($"Access token length: {conn.AccessToken.Length}");
                }

                return conn;
            }))
        {
        }

        public override IEnumerable<string> SplitScriptIntoCommands(string scriptContents)
        {
            var commandSplitter = new SqlCommandSplitter();
            var scriptStatements = commandSplitter.SplitScriptIntoCommands(scriptContents);
            return scriptStatements;
        }
    }
}
