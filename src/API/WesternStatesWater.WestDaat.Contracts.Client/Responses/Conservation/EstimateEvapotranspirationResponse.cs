namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class EstimateEvapotranspirationResponse : ApplicationStoreResponseBase
    {
        public double AverageTotalEtInInches { get; set; }

        public int? ConservationPayment { get; set; } // dollar amount
    }
}
