namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class EstimateConsumptiveUseResponse : ApplicationStoreResponseBase
    {
        public int AverageEtAcreFeet { get; set; }
        public int? ConservationPayment { get; set; } // dollar amount
    }
}
