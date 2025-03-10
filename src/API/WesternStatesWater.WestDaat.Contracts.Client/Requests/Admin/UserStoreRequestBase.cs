using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(UserProfileCreateRequest), typeDiscriminator: nameof(UserProfileCreateRequest))]
[JsonDerivedType(typeof(UserProfileUpdateRequest), typeDiscriminator: nameof(UserProfileUpdateRequest))]
public class UserStoreRequestBase : RequestBase
{
}