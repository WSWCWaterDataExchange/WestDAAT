using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class AggregatedAmountsFact
    {
        public AggregatedAmountsFact()
        {
            AggBridgeBeneficialUsesFacts = new HashSet<AggBridgeBeneficialUsesFact>();
        }

        public long AggregatedAmountId { get; set; }
        public long OrganizationId { get; set; }
        public long ReportingUnitId { get; set; }
        public long VariableSpecificId { get; set; }
        public string PrimaryUseCategoryCv { get; set; }
        public long WaterSourceId { get; set; }
        public long MethodId { get; set; }
        public long? TimeframeStartId { get; set; }
        public long? TimeframeEndId { get; set; }
        public long? DataPublicationDateId { get; set; }
        public string DataPublicationDoi { get; set; }
        public string ReportYearCv { get; set; }
        public double Amount { get; set; }
        public long? PopulationServed { get; set; }
        public double? PowerGeneratedGwh { get; set; }
        public double? IrrigatedAcreage { get; set; }
        public string InterbasinTransferToId { get; set; }
        public string InterbasinTransferFromId { get; set; }
        public string CropTypeCv { get; set; }
        public string IrrigationMethodCv { get; set; }
        public string CustomerTypeCv { get; set; }
        public string SdwisidentifierCv { get; set; }
        public string CommunityWaterSupplySystem { get; set; }
        public double? AllocationCropDutyAmount { get; set; }
        public string PowerType { get; set; }

        public virtual CropType CropTypeCvNavigation { get; set; }
        public virtual CustomerType CustomerTypeCvNavigation { get; set; }
        public virtual DateDim DataPublicationDate { get; set; }
        public virtual IrrigationMethod IrrigationMethodCvNavigation { get; set; }
        public virtual MethodsDim Method { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual PowerType PowerTypeNavigation { get; set; }
        public virtual BeneficialUse PrimaryUseCategoryCvNavigation { get; set; }
        public virtual ReportYearCv ReportYearCvNavigation { get; set; }
        public virtual ReportingUnitsDim ReportingUnit { get; set; }
        public virtual Sdwisidentifier SdwisidentifierCvNavigation { get; set; }
        public virtual DateDim TimeframeEnd { get; set; }
        public virtual DateDim TimeframeStart { get; set; }
        public virtual VariablesDim VariableSpecific { get; set; }
        public virtual WaterSourcesDim WaterSource { get; set; }
        public virtual ICollection<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFacts { get; set; }
    }
}
