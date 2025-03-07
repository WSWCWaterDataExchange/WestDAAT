namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UsernameExistsResponse : UserLoadResponseBase
{
    required public bool Exists { get; set; }
}