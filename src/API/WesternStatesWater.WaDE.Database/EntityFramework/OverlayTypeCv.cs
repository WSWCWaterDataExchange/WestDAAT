namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public class OverlayTypeCv : ControlledVocabularyBase
    {
        public OverlayTypeCv()
        {
            OverlayDim = new HashSet<OverlayDim>();
        }

        public virtual ICollection<OverlayDim> OverlayDim { get; set; }
    }
}
