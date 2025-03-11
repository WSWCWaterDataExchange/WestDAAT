using System.Diagnostics;
using System.Reflection;
using System.Threading;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class ServiceBusEmulatorListener : BackgroundService
{
    private readonly IServiceProvider _services;

    public ServiceBusEmulatorListener(IServiceProvider services)
    {
        _services = services;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var serviceBusClient =
            new ServiceBusClient("Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;");

        try
        {
            var receiverOptions = new ServiceBusReceiverOptions { ReceiveMode = ServiceBusReceiveMode.PeekLock };

            var registeredReceiverTasks = GetServiceBusTriggerMethods()
                .Select(method => RegisterReceiver(serviceBusClient, receiverOptions, method, stoppingToken))
                .ToArray();

            Debug.Assert(
                GetServiceBusTriggerMethods().Count() == registeredReceiverTasks.Length,
                "Not all queues have registered receivers."
            );

            await Task.WhenAny(registeredReceiverTasks);
        }
        catch (Exception)
        {
            Console.WriteLine("Something killed a service bus message receiver.");
            throw;
        }
    }

    private MethodInfo[] GetServiceBusTriggerMethods()
    {
        var methods = Assembly.GetExecutingAssembly().GetTypes().SelectMany(t => t.GetMethods()).ToArray();
        var serviceBusTriggerMethods = methods.Where(m =>
            m.GetParameters()
                .Any(p => p.GetCustomAttributes(typeof(ServiceBusTriggerAttribute), false).Length > 0)
        ).ToArray();

        return serviceBusTriggerMethods;
    }

    private async Task RegisterReceiver(
        ServiceBusClient serviceBusClient,
        ServiceBusReceiverOptions receiverOptions,
        MethodInfo method,
        CancellationToken stoppingToken
    )
    {
        var attribute = (ServiceBusTriggerAttribute)method.GetParameters().First().GetCustomAttributes(typeof(ServiceBusTriggerAttribute), false).First();
        var queueName = attribute.QueueName;
        var receiver = serviceBusClient.CreateReceiver(queueName, receiverOptions);

        while (!stoppingToken.IsCancellationRequested)
        {
            var message = await receiver.ReceiveMessageAsync(TimeSpan.FromSeconds(5), stoppingToken);

            if (message is null)
            {
                continue;
            }

            try
            {
                var instance = ActivatorUtilities.CreateInstance(_services, method.DeclaringType!);
                await ((Task)method.Invoke(instance, new object[] { message.Body.ToString() }))!;
                await receiver.CompleteMessageAsync(message, CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing message: {ex.Message}");
                await receiver.AbandonMessageAsync(message, cancellationToken: CancellationToken.None);
            }
        }
    }
}