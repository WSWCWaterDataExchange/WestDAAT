namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class InProgressApplicationExistsLoadResponse : ApplicationLoadResponseBase
{
    public Guid? InProgressApplicationId { get; set; }

    public Guid? FundingOrganizationId { get; set; }
}
