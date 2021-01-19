using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class SitesDim
    {
        public SitesDim()
        {
            AllocationBridgeSitesFacts = new HashSet<AllocationBridgeSitesFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public long SiteId { get; set; }
        public string SiteUuid { get; set; }
        public string SiteNativeId { get; set; }
        public string SiteName { get; set; }
        public string UsgssiteId { get; set; }
        public string SiteTypeCv { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string CoordinateMethodCv { get; set; }
        public string CoordinateAccuracy { get; set; }
        public string GniscodeCv { get; set; }
        public string EpsgcodeCv { get; set; }
        public string NhdnetworkStatusCv { get; set; }
        public string NhdproductCv { get; set; }
        public string StateCv { get; set; }
        public string Huc8 { get; set; }
        public string Huc12 { get; set; }
        public string County { get; set; }
        public string PodorPousite { get; set; }

        public virtual CoordinateMethod CoordinateMethodCvNavigation { get; set; }
        public virtual Epsgcode EpsgcodeCvNavigation { get; set; }
        public virtual GnisfeatureName GniscodeCvNavigation { get; set; }
        public virtual NhdnetworkStatus NhdnetworkStatusCvNavigation { get; set; }
        public virtual Nhdproduct NhdproductCvNavigation { get; set; }
        public virtual SiteType SiteTypeCvNavigation { get; set; }
        public virtual State StateCvNavigation { get; set; }
        public virtual ICollection<AllocationBridgeSitesFact> AllocationBridgeSitesFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
