using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

/// <summary>
/// Message bus utility that handles interacting with an external message bus. When
/// running in a local development environment, the Azure Service Bus Emulator is used.
/// </summary>
public interface IMessageBusUtility
{
    Task SendMessageAsync<T>(string queueOrTopicName, T messageObject) where T : RequestBase;
}