namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class WaterRightsDigest
    {
        public long Id { get; set; }
        public string NativeId { get; set; }
        public List<string> BeneficialUses { get; set; }
        public DateTime? PriorityDate { get; set; }
    }
}
