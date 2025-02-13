using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationDetailsListRequest), typeDiscriminator: nameof(OrganizationDetailsListRequest))]
[JsonDerivedType(typeof(OrganizationSummaryListRequest), typeDiscriminator: nameof(OrganizationSummaryListRequest))]
public class OrganizationLoadRequestBase : RequestBase
{
}