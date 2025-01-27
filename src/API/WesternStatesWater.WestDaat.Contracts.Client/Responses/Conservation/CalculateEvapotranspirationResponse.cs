namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class CalculateEvapotranspirationResponse : ApplicationLoadResponseBase
    {
        public int AverageEtAcreFeet { get; set; }
        public int? ConservationPayment { get; set; } // dollar amount
    }
}
