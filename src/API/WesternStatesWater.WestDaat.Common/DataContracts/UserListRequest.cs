namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserListRequest : UserLoadRequestBase
{
    public Guid? OrganizationId { get; set; }

    public bool IncludeGlobalAdministrators { get; set; }
}