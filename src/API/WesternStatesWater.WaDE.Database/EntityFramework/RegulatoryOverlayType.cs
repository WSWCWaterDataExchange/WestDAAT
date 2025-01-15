namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public class RegulatoryOverlayType : ControlledVocabularyBase
    {
        public RegulatoryOverlayType()
        {
            RegulatoryOverlayDim = new HashSet<RegulatoryOverlayDim>();
        }

        public virtual ICollection<RegulatoryOverlayDim> RegulatoryOverlayDim { get; set; }
    }
}
