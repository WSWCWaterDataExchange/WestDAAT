using System.Reflection;
using Microsoft.Extensions.Configuration;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Utilities;

internal static class Program
{
    static IConfiguration Configuration
    {
        get
        {
            var builder = new ConfigurationBuilder()
                .AddUserSecrets("c1737752-7419-4b21-a3f0-09d1f742fd1d")
                .AddEnvironmentVariables();

            return builder.Build();
        }
    }

    private static async Task Main(string[]? args)
    {
        await CreateMessageBusQueues();
    }

    private static async Task CreateMessageBusQueues()
    {
        var messageBusConfig = Configuration.GetMessageBusConfiguration();
        var envConfig = Configuration.GetEnvironmentConfiguration();
            
        var messageBusUtility = new MessageBusUtility(messageBusConfig, envConfig);

        var postfix = $"-{envConfig.Username.ToLower()}";
        Console.WriteLine($@"Creating message bus queues at {messageBusConfig.ServiceBusUrl}...");
        Console.WriteLine($@"Using machine username postfix of '{postfix}'");

        var queueNames = AzureQueueNames();
        foreach (var queueName in queueNames)
        {
            Console.WriteLine($@"Creating {queueName}{postfix} queue...");
            await messageBusUtility.CreateQueueIfNotExists(queueName);
            Console.WriteLine(@"Success.");
        }

        Console.WriteLine(@"Successfully created queues.");
    }

    private static string[] AzureQueueNames()
    {
        var queueNames = typeof(Queues)
            .GetFields(BindingFlags.Static | BindingFlags.Public)
            .Where(x => x.IsLiteral && !x.IsInitOnly)
            .Select(x => x.GetValue(null)).Cast<string>().ToArray();

        return queueNames;
    }
}