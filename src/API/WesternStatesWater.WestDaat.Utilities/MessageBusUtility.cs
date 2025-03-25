using System.Collections.Concurrent;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Utilities;

public class MessageBusUtility : IMessageBusUtility, IAsyncDisposable
{
    private readonly ServiceBusClient _serviceBusClient;
    private readonly ConcurrentDictionary<string, ServiceBusSender> _messageBusSenderCache;

    public MessageBusUtility(MessageBusConfiguration messageBusConfig)
    {
        _serviceBusClient = messageBusConfig.UseDevelopmentEmulator
            ? new ServiceBusClient(messageBusConfig.ServiceBusUrl)
            : new ServiceBusClient(messageBusConfig.ServiceBusUrl, ConfigurationHelper.TokenCredential);

        _messageBusSenderCache = new ConcurrentDictionary<string, ServiceBusSender>();
    }

    public async Task SendMessageAsync<T>(string queueOrTopicName, T messageObject) where T : RequestBase
    {
        var message = JsonSerializer.Serialize(messageObject, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var sender = GetServiceBusSender(queueOrTopicName);

        await sender.SendMessageAsync(new ServiceBusMessage(message));
    }

    private ServiceBusSender GetServiceBusSender(string queueOrTopicName)
    {
        return _messageBusSenderCache.GetOrAdd(queueOrTopicName, a => _serviceBusClient.CreateSender(a));
    }

    public async ValueTask DisposeAsync()
    {
        await _serviceBusClient.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}