using System;
using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class ReportYearCv
    {
        public ReportYearCv()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
    }
}
