using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class Unit
    {
        public Unit()
        {
            VariablesDimAggregationIntervalUnitCvNavigations = new HashSet<VariablesDim>();
            VariablesDimAmountUnitCvNavigations = new HashSet<VariablesDim>();
            VariablesDimMaximumAmountUnitCvNavigations = new HashSet<VariablesDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }
        public string WaDename { get; set; }

        public virtual ICollection<VariablesDim> VariablesDimAggregationIntervalUnitCvNavigations { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimAmountUnitCvNavigations { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimMaximumAmountUnitCvNavigations { get; set; }
    }
}
