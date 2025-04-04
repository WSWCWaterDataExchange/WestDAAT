namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation
{
    public class ReviewerEstimateConsumptiveUseResponse : ApplicationStoreResponseBase
    {
        /// <summary>
        /// The average yearly estimated total et in acre-feet for all polygons.
        /// </summary>
        public double CumulativeTotalEtInAcreFeet { get; set; }

        /// <summary>
        /// The average yearly estimated net et in acre-feet for all polygons.
        /// </summary>
        public double CumulativeNetEtInAcreFeet { get; set; }

        /// <summary>
        /// The total estimated conservation payment in dollars.
        /// </summary>
        public int ConservationPayment { get; set; }

        /// <summary>
        /// A summary of estimated consumptive use data per location, along with each location's yearly data points.
        /// </summary>
        public PolygonEtDataCollection[] DataCollections { get; set; }

        /// <summary>
        /// A summary of estimated consumptive use data for the control location, along with its yearly data points.
        /// </summary>
        public PointEtDataCollection ControlDataCollection { get; set; }
    }
}
