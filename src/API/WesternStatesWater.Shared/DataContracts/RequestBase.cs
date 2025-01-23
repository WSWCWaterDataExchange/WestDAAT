using System.Text.Json.Serialization;

namespace WesternStatesWater.Shared.DataContracts;

[JsonDerivedType(typeof(RequestBase), typeDiscriminator: "base")]
public abstract class RequestBase
{
}