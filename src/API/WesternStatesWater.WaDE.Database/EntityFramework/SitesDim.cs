using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class SitesDim
    {
        public SitesDim()
        {
            AllocationBridgeSitesFact = new HashSet<AllocationBridgeSitesFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
            WaterSourceBridgeSitesFact = new HashSet<WaterSourceBridgeSitesFact>();
        }

        public long SiteId { get; set; }
        [MaxLength(200)]
        public string SiteUuid { get; set; }
        [MaxLength(50)]
        public string SiteNativeId { get; set; }
        [MaxLength(500)]
        public string SiteName { get; set; }
        public string UsgssiteId { get; set; }
        [MaxLength(100)]
        public string SiteTypeCv { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public Geometry SitePoint { get; set; }
        public Geometry Geometry { get; set; }
        [MaxLength(100)]
        public string CoordinateMethodCv { get; set; }
        [MaxLength(255)]
        public string CoordinateAccuracy { get; set; }
        [MaxLength(250)]
        public string GniscodeCv { get; set; }
        [MaxLength(50)]
        public string EpsgcodeCv { get; set; }
        [MaxLength(50)]
        public string NhdnetworkStatusCv { get; set; }
        [MaxLength(50)]
        public string NhdproductCv { get; set; }
        [MaxLength(2)]
        public string StateCv { get; set; }
        [MaxLength(20)]
        public string HUC8 { get; set; }
        [MaxLength(20)]
        public string HUC12 { get; set; }
        [MaxLength(20)]
        public string County { get; set; }
        [MaxLength(50)]
        public string PODorPOUSite { get; set; }

        public virtual CoordinateMethod CoordinateMethodCvNavigation { get; set; }
        public virtual Epsgcode EpsgcodeCvNavigation { get; set; }
        public virtual GnisfeatureName GniscodeCvNavigation { get; set; }
        public virtual NhdnetworkStatus NhdnetworkStatusCvNavigation { get; set; }
        public virtual Nhdproduct NhdproductCvNavigation { get; set; }
        public virtual SiteType SiteTypeCvNavigation { get; set; }
        public virtual State StateCVNavigation { get; set; }
        public virtual ICollection<AllocationBridgeSitesFact> AllocationBridgeSitesFact { get; set; }
        public virtual ICollection<WaterSourceBridgeSitesFact> WaterSourceBridgeSitesFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
        public virtual ICollection<RegulatoryOverlayBridgeSitesFact> RegulatoryOverlayBridgeSitesFact { get; set; }
        public virtual ICollection<PODSiteToPOUSiteFact> PODSiteToPOUSitePODFact { get; set; }
        public virtual ICollection<PODSiteToPOUSiteFact> PODSiteToPOUSitePOUFact { get; set; }
    }
}
