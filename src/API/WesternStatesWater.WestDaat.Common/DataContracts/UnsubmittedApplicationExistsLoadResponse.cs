namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UnsubmittedApplicationExistsLoadResponse : ApplicationLoadResponseBase
{
    public Guid? InProgressApplicationId { get; set; }

    public string InProgressApplicationDisplayId { get; set; }

    public Guid? FundingOrganizationId { get; set; }
}
