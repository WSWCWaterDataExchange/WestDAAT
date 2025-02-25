using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationUserListRequest), typeDiscriminator: nameof(OrganizationUserListRequest))]
[JsonDerivedType(typeof(UserListRequest), typeDiscriminator: nameof(UserListRequest))]
[JsonDerivedType(typeof(UserProfileRequest), typeDiscriminator: nameof(UserProfileRequest))]
[JsonDerivedType(typeof(UserSearchRequest), typeDiscriminator: nameof(UserSearchRequest))]
public class UserLoadRequestBase : RequestBase
{
}