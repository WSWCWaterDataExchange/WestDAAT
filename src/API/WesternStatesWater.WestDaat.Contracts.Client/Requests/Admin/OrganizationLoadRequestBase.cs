using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationLoadAllRequest), typeDiscriminator: nameof(OrganizationLoadAllRequest))]
public class OrganizationLoadRequestBase : RequestBase
{
}