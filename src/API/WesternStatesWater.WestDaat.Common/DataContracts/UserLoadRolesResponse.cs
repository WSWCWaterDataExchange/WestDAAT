﻿namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserLoadRolesResponse : UserLoadResponseBase
{
    public Guid UserId { get; set; }
    public string[] UserRoles { get; set; }
    public UserOrganizationRoleDetails[] UserOrganizationRoles { get; set; }
}
