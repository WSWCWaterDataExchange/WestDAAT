using System.Collections.Concurrent;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Azure.Messaging.ServiceBus.Administration;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Utilities;

public class MessageBusUtility : IMessageBusUtility, IAsyncDisposable
{
    private readonly ServiceBusClient _serviceBusClient;
    private readonly ServiceBusAdministrationClient _serviceBusAdminClient;
    private readonly ConcurrentDictionary<string, ServiceBusSender> _messageBusSenderCache;
    private readonly EnvironmentConfiguration _environmentConfiguration;

    public MessageBusUtility(MessageBusConfiguration messageBusConfig, EnvironmentConfiguration environmentConfig)
    {
        _serviceBusClient = new ServiceBusClient($"{messageBusConfig.ServiceBusUrl}", ConfigurationHelper.TokenCredential);
        _serviceBusAdminClient = new ServiceBusAdministrationClient(messageBusConfig.ServiceBusUrl, ConfigurationHelper.TokenCredential);
        _messageBusSenderCache = new ConcurrentDictionary<string, ServiceBusSender>();
        _environmentConfiguration = environmentConfig;
    }

    public async Task SendMessageAsync<T>(string queueOrTopicName, T messageObject) where T : RequestBase
    {
        var message = JsonSerializer.Serialize<RequestBase>(messageObject);

        queueOrTopicName = LocalizeQueueName(queueOrTopicName);

        var sender = GetServiceBusSender(queueOrTopicName);

        await sender.SendMessageAsync(new ServiceBusMessage(message));
    }

    /// <summary>
    /// Used to create a service bus queue. Should only be used in development environments.
    /// For QA+ environments, queues should be created in the Azure portal.
    /// </summary>
    /// <param name="queueName"></param>
    public async Task CreateQueueIfNotExists(string queueName)
    {
        queueName = LocalizeQueueName(queueName);

        var queueExists = await ServiceBusQueueExists(queueName);
        if (!queueExists)
        {
            await _serviceBusAdminClient.CreateQueueAsync(queueName);
        }
    }

    private async Task<bool> ServiceBusQueueExists(string queueName)
    {
        var queueNames = new List<string>();
        var queuesListingResult = _serviceBusAdminClient.GetQueuesAsync();
        await foreach (var item in queuesListingResult)
        {
            queueNames.Add(item.Name);
        }

        return queueNames.Contains(queueName);
    }

    private ServiceBusSender GetServiceBusSender(string queueOrTopicName)
    {
        return _messageBusSenderCache.GetOrAdd(queueOrTopicName, a => _serviceBusClient.CreateSender(a));
    }

    private string LocalizeQueueName(string queueName)
    {
        if (_environmentConfiguration.IsLocalEnvironment)
        {
            queueName = $"{queueName}-{_environmentConfiguration.Username}";
        }

        return queueName;
    }

    public async ValueTask DisposeAsync()
    {
        await _serviceBusClient.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}