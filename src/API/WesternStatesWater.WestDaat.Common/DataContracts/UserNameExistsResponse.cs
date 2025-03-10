namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserNameExistsResponse : UserLoadResponseBase
{
    required public bool Exists { get; set; }
}