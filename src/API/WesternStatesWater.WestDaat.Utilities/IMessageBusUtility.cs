using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Utilities;

// TODO Summary
public interface IMessageBusUtility
{
    Task SendMessageAsync<T>(string queueOrTopicName, T messageObject) where T : RequestBase;
}