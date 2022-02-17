using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class ReportYearCv
    {
        public ReportYearCv()
        {
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }
        public string WaDename { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
