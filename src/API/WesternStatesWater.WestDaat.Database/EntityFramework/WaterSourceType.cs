namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class WaterSourceType : ControlledVocabularyBase
    {
        public WaterSourceType()
        {
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }

        public virtual ICollection<RegulatoryOverlayDim> RegulatoryOverlayDim { get; set; }
    }
}
