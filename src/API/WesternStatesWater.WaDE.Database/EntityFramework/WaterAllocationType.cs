﻿namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class WaterAllocationType : ControlledVocabularyBase
    {
        public WaterAllocationType()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }
        
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}