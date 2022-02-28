using System;
using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class Units
    {
        public Units()
        {
            VariablesDimAggregationIntervalUnitCvNavigation = new HashSet<VariablesDim>();
            VariablesDimAmountUnitCvNavigation = new HashSet<VariablesDim>();
            VariablesDimMaximumAmountUnitCvNavigation = new HashSet<VariablesDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<VariablesDim> VariablesDimAggregationIntervalUnitCvNavigation { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimAmountUnitCvNavigation { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimMaximumAmountUnitCvNavigation { get; set; }
    }
}
