using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(ApplicationDashboardLoadRequest), typeDiscriminator: nameof(ApplicationDashboardLoadRequest))]
public class ApplicationLoadRequestBase : RequestBase
{
}