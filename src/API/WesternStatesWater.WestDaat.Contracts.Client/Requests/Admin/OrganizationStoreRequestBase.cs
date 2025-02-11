using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationMemberAddRequest), typeDiscriminator: nameof(OrganizationMemberAddRequest))]
public class OrganizationStoreRequestBase : RequestBase
{
}