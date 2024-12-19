namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class AggregatedAmountsFact
    {
        public AggregatedAmountsFact()
        {
            AggBridgeBeneficialUsesFact = new HashSet<AggBridgeBeneficialUsesFact>();
        }

        public long AggregatedAmountId { get; set; }
        public long OrganizationId { get; set; }
        public long ReportingUnitId { get; set; }
        public long VariableSpecificId { get; set; }
        public string PrimaryUseCategoryCV { get; set; }
        public long WaterSourceId { get; set; }
        public long MethodId { get; set; }
        public long? TimeframeStartId { get; set; }
        public long? TimeframeEndId { get; set; }
        public long? DataPublicationDateID { get; set; }
        public string DataPublicationDoi { get; set; }
        public string ReportYearCv { get; set; }
        public double Amount { get; set; }
        public long? PopulationServed { get; set; }
        public double? PowerGeneratedGwh { get; set; }
        public double? IrrigatedAcreage { get; set; }
        public string InterbasinTransferToId { get; set; }
        public string InterbasinTransferFromId { get; set; }

        public string CropTypeCV { get; set; }

        public string IrrigationMethodCV { get; set; }

        public string CustomerTypeCV { get; set; }

        public string SDWISIdentifierCV { get; set; }

        public string CommunityWaterSupplySystem { get; set; }

        public double? AllocationCropDutyAmount { get; set; }

        public string PowerType { get; set; }

        public virtual BeneficialUsesCV PrimaryBeneficialUse { get; set; }
        public virtual DateDim DataPublicationDateNavigation { get; set; }
        public virtual MethodsDim Method { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual ReportYearCv ReportYearCvNavigation { get; set; }
        public virtual ReportingUnitsDim ReportingUnit { get; set; }
        public virtual DateDim TimeframeEnd { get; set; }
        public virtual DateDim TimeframeStart { get; set; }
        public virtual VariablesDim VariableSpecific { get; set; }
        public virtual WaterSourcesDim WaterSource { get; set; }

        public virtual IrrigationMethod IrrigationMethod { get; set; }
        public virtual CustomerType CustomerType { get; set; }
        public virtual SDWISIdentifier SDWISIdentifier { get; set; }
        public virtual CropType CropType { get; set; }
        public virtual PowerType PowerTypeCV { get; set; }
        public virtual ICollection<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFact { get; set; }
    }
}
