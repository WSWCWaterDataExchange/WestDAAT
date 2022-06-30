namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class WaterRightInfoListItem
    {
        public string AllocationUuid { get; set; }
        public string WaterRightNativeId { get; set; }
        public string Owner { get; set; }
        public DateTime? PriorityDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string LegalStatus { get; set; }
        public double? Flow { get; set; }
        public double? Volume { get; set; }
        public List<string> BeneficialUses { get; set; }
    }
}
