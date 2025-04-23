namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class WaterSourceType : ControlledVocabularyBase
    {
        public WaterSourceType()
        {
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }

        public virtual ICollection<OverlayDim> OverlayDim { get; set; }
    }
}
