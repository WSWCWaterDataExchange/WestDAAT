using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationMemberAddRequest), typeDiscriminator: nameof(OrganizationMemberAddRequest))]
[JsonDerivedType(typeof(OrganizationMemberRemoveRequest), typeDiscriminator: nameof(OrganizationMemberRemoveRequest))]
[JsonDerivedType(typeof(OrganizationMemberUpdateRequest), typeDiscriminator: nameof(OrganizationMemberUpdateRequest))]
public class OrganizationStoreRequestBase : RequestBase
{
}