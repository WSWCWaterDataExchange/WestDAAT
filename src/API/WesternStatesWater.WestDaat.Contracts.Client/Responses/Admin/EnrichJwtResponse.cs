﻿using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class EnrichJwtResponse : UserLoadResponseBase
{
    public string Version { get; set; }

    public string Action { get; set; }

    [JsonPropertyName("extension_westdaat_userId")]
    public string Extension_WestDaat_UserId { get; set; }


    [JsonPropertyName("extension_westdaat_roles")]
    public string Extension_WestDaat_Roles { get; set; }

    [JsonPropertyName("extension_westdaat_organizationRoles")]
    public string Extension_WestDaat_OrganizationRoles { get; set; }
}