using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Common
{
    public enum AnalyticsInformationGrouping
    {
        None = 0, // project doesn't build without this value

        [Display(Name = "Beneficial Use")]
        BeneficialUse = 1,

        [Display(Name = "Water Source Type")]
        WaterSourceType = 2,

        [Display(Name = "Owner Type")]
        OwnerType = 3,

        [Display(Name = "Allocation Type")]
        AllocationType = 4,

        [Display(Name = "Legal Status")]
        LegalStatus = 5,

        [Display(Name = "Site Type")]
        SiteType = 6,
    }
}
