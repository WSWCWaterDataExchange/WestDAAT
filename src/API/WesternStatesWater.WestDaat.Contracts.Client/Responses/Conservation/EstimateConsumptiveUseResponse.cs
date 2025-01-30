namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class EstimateConsumptiveUseResponse : ApplicationStoreResponseBase
    {
        public int AverageEtAcreFeet { get; set; }

        /// <summary>
        /// The total estimated conservation payment in dollars.
        /// </summary>
        public int? ConservationPayment { get; set; }
    }
}
