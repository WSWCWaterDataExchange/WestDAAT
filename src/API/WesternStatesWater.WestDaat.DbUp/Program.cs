using DbUp;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.DbUp;

class Program
{
    static IConfiguration Configuration
    {
        get
        {
            var builder = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "ConnectionStrings:WestDaatDatabase", "Server=localhost;Initial Catalog=WestDAAT;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;" },
                    { "ConnectionStrings:WestDaatDatabaseTest", "Server=localhost;Initial Catalog=WestDAATTest;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;" }
                }!)
                .AddEnvironmentVariables()
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true);

            return builder.Build();
        }
    }

    static void Main()
    {
        // DbUp runs against the local and test db if you're in DEBUG
        var connectionStrings =
#if DEBUG
            new[]
            {
                Configuration["ConnectionStrings:WestDaatDatabase"],
                Configuration["ConnectionStrings:WestDaatDatabaseTest"]
            };
#else
                new[] { Configuration["ConnectionStrings:WestDaatDatabase"] };
#endif

        foreach (var connectionString in connectionStrings)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new WestDaatException("Connection string not found.");
            }

            EnsureDatabase.For.SqlDatabase(connectionString);

            UpdateDb(connectionString);
        }
    }

    private static void UpdateDb(string connectionString)
    {
        var migrator = DeployChanges.To
            .SqlDatabase(connectionString)
            .WithTransaction()
            .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
            .WithExecutionTimeout(TimeSpan.FromSeconds(30))
            .LogToConsole()
            .Build();

        var result = migrator.PerformUpgrade();

        if (!result.Successful)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(result.Error);
            Console.ResetColor();

            if (Environment.UserInteractive)
            {
                Console.ReadLine();
            }

            // Blow up so the CI fails
            throw result.Error;
        }

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("Success!");
        Console.ResetColor();
    }
}