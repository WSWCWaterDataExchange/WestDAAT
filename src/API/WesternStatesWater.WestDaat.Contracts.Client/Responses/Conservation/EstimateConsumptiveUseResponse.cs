namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class EstimateConsumptiveUseResponse : ApplicationStoreResponseBase
    {
        /// <summary>
        /// The average yearly estimated total et in acre-feet for all polygons.
        /// </summary>
        public double CumulativeTotalEtInAcreFeet { get; set; }

        /// <summary>
        /// The total estimated conservation payment in dollars.
        /// </summary>
        public int? ConservationPayment { get; set; }

        /// <summary>
        /// The average yearly estimated consumptive use in acre-feet per polygon, as well as the yearly data points.
        /// </summary>
        public PolygonEtDataCollection[] DataCollections { get; set; }
    }
}
