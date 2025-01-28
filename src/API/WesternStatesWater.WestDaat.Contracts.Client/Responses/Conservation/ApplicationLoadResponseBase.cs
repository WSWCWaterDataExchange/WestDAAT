using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

[JsonDerivedType(typeof(ApplicationDashboardLoadResponse), typeDiscriminator: nameof(ApplicationDashboardLoadResponse))]
public class ApplicationLoadResponseBase : ResponseBase
{
}