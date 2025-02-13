using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(OrganizationListDetailsRequest), typeDiscriminator: nameof(OrganizationListDetailsRequest))]
[JsonDerivedType(typeof(OrganizationListSummaryRequest), typeDiscriminator: nameof(OrganizationListSummaryRequest))]
public class OrganizationLoadRequestBase : RequestBase
{
}