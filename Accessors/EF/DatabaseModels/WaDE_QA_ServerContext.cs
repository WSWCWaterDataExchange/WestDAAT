using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class WaDE_QA_ServerContext : DbContext
    {
        public WaDE_QA_ServerContext()
        {
        }

        public WaDE_QA_ServerContext(DbContextOptions<WaDE_QA_ServerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFacts { get; set; }
        public virtual DbSet<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual DbSet<AggregationStatistic> AggregationStatistics { get; set; }
        public virtual DbSet<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual DbSet<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFacts { get; set; }
        public virtual DbSet<AllocationBridgeSitesFact> AllocationBridgeSitesFacts { get; set; }
        public virtual DbSet<ApplicableResourceType> ApplicableResourceTypes { get; set; }
        public virtual DbSet<AzureSqlmaintenanceLog> AzureSqlmaintenanceLogs { get; set; }
        public virtual DbSet<BeneficialUse> BeneficialUses { get; set; }
        public virtual DbSet<CoordinateMethod> CoordinateMethods { get; set; }
        public virtual DbSet<CropType> CropTypes { get; set; }
        public virtual DbSet<CustomerType> CustomerTypes { get; set; }
        public virtual DbSet<DataQualityValue> DataQualityValues { get; set; }
        public virtual DbSet<DateDim> DateDims { get; set; }
        public virtual DbSet<Epsgcode> Epsgcodes { get; set; }
        public virtual DbSet<GnisfeatureName> GnisfeatureNames { get; set; }
        public virtual DbSet<ImportError> ImportErrors { get; set; }
        public virtual DbSet<IrrigationMethod> IrrigationMethods { get; set; }
        public virtual DbSet<LegalStatus> LegalStatuses { get; set; }
        public virtual DbSet<MethodType> MethodTypes { get; set; }
        public virtual DbSet<MethodsDim> MethodsDims { get; set; }
        public virtual DbSet<NhdnetworkStatus> NhdnetworkStatuses { get; set; }
        public virtual DbSet<Nhdproduct> Nhdproducts { get; set; }
        public virtual DbSet<OrganizationsDim> OrganizationsDims { get; set; }
        public virtual DbSet<PowerType> PowerTypes { get; set; }
        public virtual DbSet<RegulatoryOverlayDim> RegulatoryOverlayDims { get; set; }
        public virtual DbSet<RegulatoryOverlayType> RegulatoryOverlayTypes { get; set; }
        public virtual DbSet<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFacts { get; set; }
        public virtual DbSet<RegulatoryStatus> RegulatoryStatuses { get; set; }
        public virtual DbSet<ReportYearCv> ReportYearCvs { get; set; }
        public virtual DbSet<ReportYearType> ReportYearTypes { get; set; }
        public virtual DbSet<ReportingUnitType> ReportingUnitTypes { get; set; }
        public virtual DbSet<ReportingUnitsDim> ReportingUnitsDims { get; set; }
        public virtual DbSet<SchemaVersion> SchemaVersions { get; set; }
        public virtual DbSet<Sdwisidentifier> Sdwisidentifiers { get; set; }
        public virtual DbSet<SiteType> SiteTypes { get; set; }
        public virtual DbSet<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
        public virtual DbSet<SitesBridgeBeneficialUsesFact> SitesBridgeBeneficialUsesFacts { get; set; }
        public virtual DbSet<SitesDim> SitesDims { get; set; }
        public virtual DbSet<State> States { get; set; }
        public virtual DbSet<Unit> Units { get; set; }
        public virtual DbSet<Variable> Variables { get; set; }
        public virtual DbSet<VariableSpecific> VariableSpecifics { get; set; }
        public virtual DbSet<VariablesDim> VariablesDims { get; set; }
        public virtual DbSet<WaterAllocationBasis> WaterAllocationBases { get; set; }
        public virtual DbSet<WaterAllocationType> WaterAllocationTypes { get; set; }
        public virtual DbSet<WaterQualityIndicator> WaterQualityIndicators { get; set; }
        public virtual DbSet<WaterSourceType> WaterSourceTypes { get; set; }
        public virtual DbSet<WaterSourcesDim> WaterSourcesDims { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=[YOUR DATABASE SERVER];Database=[YOUR DATABASE NAME];User ID=[YOUR DATABASE USER ID];password=[YOUR DATABASE PASSWORD];MultipleActiveResultSets=False;TrustServerCertificate=False;Encrypt=True;Connection Timeout=90;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AggBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.AggBridgeId)
                    .HasName("pkAggBridge_BeneficialUses_fact");

                entity.ToTable("AggBridge_BeneficialUses_fact", "Core");

                entity.HasIndex(e => new { e.BeneficialUseCv, e.AggregatedAmountId })
                    .IsUnique()
                    .HasName("AK_SiteBridgeBeneficialUses_BeneficialUseCvSiteVariableAmountId");

                entity.HasIndex(e => e.AggregatedAmountId)
                    .HasName("IX_SiteBridgeBeneficialUses_AggregatedAmountId");

                entity.Property(e => e.AggBridgeId).HasColumnName("AggBridgeID");

                entity.Property(e => e.AggregatedAmountId).HasColumnName("AggregatedAmountID");

                entity.Property(e => e.BeneficialUseCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("BeneficialUseCV");

                entity.HasOne(d => d.AggregatedAmount)
                    .WithMany(p => p.AggBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.AggregatedAmountId)
                    .HasConstraintName("fk_AggBridge_BeneficialUses_fact_AggregatedAmounts_fact");

                entity.HasOne(d => d.BeneficialUseCvNavigation)
                    .WithMany(p => p.AggBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.BeneficialUseCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AggBridge_BeneficialUses");
            });

            modelBuilder.Entity<AggregatedAmountsFact>(entity =>
            {
                entity.HasKey(e => e.AggregatedAmountId)
                    .HasName("pkAggregatedAmounts_fact");

                entity.ToTable("AggregatedAmounts_fact", "Core");

                entity.HasIndex(e => e.PrimaryUseCategoryCv)
                    .HasName("IX_AggregatedAmounts_PrimaryUseCategory");

                entity.HasIndex(e => e.ReportingUnitId)
                    .HasName("IX_AggregatedAmounts_ReportingUnitId");

                entity.HasIndex(e => e.TimeframeEndId)
                    .HasName("IX_AggregatedAmounts_TimeframeEndDate");

                entity.HasIndex(e => e.TimeframeStartId)
                    .HasName("IX_AggregatedAmounts_TimeframeStartDate");

                entity.HasIndex(e => e.VariableSpecificId)
                    .HasName("IX_AggregatedAmounts_VariableSpecificId");

                entity.Property(e => e.AggregatedAmountId).HasColumnName("AggregatedAmountID");

                entity.Property(e => e.CommunityWaterSupplySystem).HasMaxLength(250);

                entity.Property(e => e.CropTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CropTypeCV");

                entity.Property(e => e.CustomerTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CustomerTypeCV");

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.DataPublicationDoi)
                    .HasMaxLength(100)
                    .HasColumnName("DataPublicationDOI");

                entity.Property(e => e.InterbasinTransferFromId)
                    .HasMaxLength(100)
                    .HasColumnName("InterbasinTransferFromID");

                entity.Property(e => e.InterbasinTransferToId)
                    .HasMaxLength(100)
                    .HasColumnName("InterbasinTransferToID");

                entity.Property(e => e.IrrigationMethodCv)
                    .HasMaxLength(100)
                    .HasColumnName("IrrigationMethodCV");

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.PowerGeneratedGwh).HasColumnName("PowerGeneratedGWh");

                entity.Property(e => e.PowerType).HasMaxLength(50);

                entity.Property(e => e.PrimaryUseCategoryCv)
                    .HasMaxLength(100)
                    .HasColumnName("PrimaryUseCategoryCV");

                entity.Property(e => e.ReportYearCv)
                    .HasMaxLength(4)
                    .HasColumnName("ReportYearCV")
                    .IsFixedLength(true);

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.Property(e => e.SdwisidentifierCv)
                    .HasMaxLength(100)
                    .HasColumnName("SDWISIdentifierCV");

                entity.Property(e => e.TimeframeEndId).HasColumnName("TimeframeEndID");

                entity.Property(e => e.TimeframeStartId).HasColumnName("TimeframeStartID");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.HasOne(d => d.CropTypeCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.CropTypeCv)
                    .HasConstraintName("FK_AggregatedAmounts_CropType");

                entity.HasOne(d => d.CustomerTypeCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.CustomerTypeCv)
                    .HasConstraintName("FK_AggregatedAmounts_CustomerType");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.AggregatedAmountsFactDataPublicationDates)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_end_pub");

                entity.HasOne(d => d.IrrigationMethodCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.IrrigationMethodCv)
                    .HasConstraintName("FK_AggregatedAmounts_IrrigationMethod");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.PowerTypeNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.PowerType)
                    .HasConstraintName("fk_AggregatedAmounts_fact_PowerTypeCV");

                entity.HasOne(d => d.PrimaryUseCategoryCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.PrimaryUseCategoryCv)
                    .HasConstraintName("FK_AggregatedAmounts_BeneficialUses");

                entity.HasOne(d => d.ReportYearCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.ReportYearCv)
                    .HasConstraintName("fk_AggregatedAmounts_fact_ReportYearCV");

                entity.HasOne(d => d.ReportingUnit)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.ReportingUnitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_ReportingUnits_dim");

                entity.HasOne(d => d.SdwisidentifierCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.SdwisidentifierCv)
                    .HasConstraintName("FK_AggregatedAmounts_SDWISIdentifier");

                entity.HasOne(d => d.TimeframeEnd)
                    .WithMany(p => p.AggregatedAmountsFactTimeframeEnds)
                    .HasForeignKey(d => d.TimeframeEndId)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_end");

                entity.HasOne(d => d.TimeframeStart)
                    .WithMany(p => p.AggregatedAmountsFactTimeframeStarts)
                    .HasForeignKey(d => d.TimeframeStartId)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_start");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Variables_dim");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.AggregatedAmountsFacts)
                    .HasForeignKey(d => d.WaterSourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_WaterSources_dim");
            });

            modelBuilder.Entity<AggregationStatistic>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkAggregationStatistic");

                entity.ToTable("AggregationStatistic", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<AllocationAmountsFact>(entity =>
            {
                entity.HasKey(e => e.AllocationAmountId)
                    .HasName("pkAllocationAmounts_fact");

                entity.ToTable("AllocationAmounts_fact", "Core");

                entity.HasIndex(e => e.AllocationPriorityDateId)
                    .HasName("IX_AllocationAmounts_AllocationPriorityDate");

                entity.HasIndex(e => e.PrimaryUseCategoryCv)
                    .HasName("IX_AllocationAmounts_PrimaryUseCategory");

                entity.HasIndex(e => e.OrganizationId)
                    .HasName("nci_wi_AllocationAmounts_fact_5BCE1052867ADD63C5E1B830C50E6489");

                entity.HasIndex(e => e.OrganizationId)
                    .HasName("nci_wi_AllocationAmounts_fact_78FD4A2D813E9B054230DB44DEF7FC5B");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.AllocationApplicationDateId).HasColumnName("AllocationApplicationDateID");

                entity.Property(e => e.AllocationAssociatedConsumptiveUseSiteIds)
                    .HasMaxLength(500)
                    .HasColumnName("AllocationAssociatedConsumptiveUseSiteIDs");

                entity.Property(e => e.AllocationAssociatedWithdrawalSiteIds)
                    .HasMaxLength(500)
                    .HasColumnName("AllocationAssociatedWithdrawalSiteIDs");

                entity.Property(e => e.AllocationBasisCv)
                    .HasMaxLength(250)
                    .HasColumnName("AllocationBasisCV");

                entity.Property(e => e.AllocationChangeApplicationIndicator).HasMaxLength(100);

                entity.Property(e => e.AllocationCommunityWaterSupplySystem).HasMaxLength(250);

                entity.Property(e => e.AllocationExpirationDateId).HasColumnName("AllocationExpirationDateID");

                entity.Property(e => e.AllocationFlowCfs).HasColumnName("AllocationFlow_CFS");

                entity.Property(e => e.AllocationLegalStatusCv)
                    .HasMaxLength(250)
                    .HasColumnName("AllocationLegalStatusCV");

                entity.Property(e => e.AllocationNativeId)
                    .HasMaxLength(250)
                    .HasColumnName("AllocationNativeID");

                entity.Property(e => e.AllocationOwner).HasMaxLength(500);

                entity.Property(e => e.AllocationPriorityDateId).HasColumnName("AllocationPriorityDateID");

                entity.Property(e => e.AllocationTimeframeEnd).HasMaxLength(6);

                entity.Property(e => e.AllocationTimeframeStart).HasMaxLength(6);

                entity.Property(e => e.AllocationTypeCv)
                    .HasMaxLength(250)
                    .HasColumnName("AllocationTypeCV");

                entity.Property(e => e.AllocationVolumeAf).HasColumnName("AllocationVolume_AF");

                entity.Property(e => e.CommunityWaterSupplySystem).HasMaxLength(250);

                entity.Property(e => e.CropTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CropTypeCV");

                entity.Property(e => e.CustomerTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CustomerTypeCV");

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.DataPublicationDoi)
                    .HasMaxLength(100)
                    .HasColumnName("DataPublicationDOI");

                entity.Property(e => e.GeneratedPowerCapacityMw).HasColumnName("GeneratedPowerCapacityMW");

                entity.Property(e => e.IrrigationMethodCv)
                    .HasMaxLength(100)
                    .HasColumnName("IrrigationMethodCV");

                entity.Property(e => e.LegacyAllocationIds)
                    .HasMaxLength(250)
                    .HasColumnName("LegacyAllocationIDs");

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.PowerType).HasMaxLength(50);

                entity.Property(e => e.PrimaryUseCategoryCv)
                    .HasMaxLength(100)
                    .HasColumnName("PrimaryUseCategoryCV");

                entity.Property(e => e.SdwisidentifierCv)
                    .HasMaxLength(100)
                    .HasColumnName("SDWISIdentifierCV");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterAllocationNativeUrl)
                    .HasMaxLength(250)
                    .HasColumnName("WaterAllocationNativeURL");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.HasOne(d => d.AllocationApplicationDate)
                    .WithMany(p => p.AllocationAmountsFactAllocationApplicationDates)
                    .HasForeignKey(d => d.AllocationApplicationDateId)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_appl");

                entity.HasOne(d => d.AllocationBasisCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.AllocationBasisCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_WaterAllocationBasis");

                entity.HasOne(d => d.AllocationExpirationDate)
                    .WithMany(p => p.AllocationAmountsFactAllocationExpirationDates)
                    .HasForeignKey(d => d.AllocationExpirationDateId)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_expir");

                entity.HasOne(d => d.AllocationLegalStatusCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.AllocationLegalStatusCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_LegalStatus");

                entity.HasOne(d => d.AllocationPriorityDate)
                    .WithMany(p => p.AllocationAmountsFactAllocationPriorityDates)
                    .HasForeignKey(d => d.AllocationPriorityDateId)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_priority");

                entity.HasOne(d => d.AllocationTypeCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.AllocationTypeCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_WaterRightType");

                entity.HasOne(d => d.CropTypeCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.CropTypeCv)
                    .HasConstraintName("FK_AllocationAmounts_CropType");

                entity.HasOne(d => d.CustomerTypeCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.CustomerTypeCv)
                    .HasConstraintName("FK_AllocationAmounts_CustomerType");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.AllocationAmountsFactDataPublicationDates)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_pub");

                entity.HasOne(d => d.IrrigationMethodCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.IrrigationMethodCv)
                    .HasConstraintName("FK_AllocationAmounts_IrrigationMethod");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.PowerTypeNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.PowerType)
                    .HasConstraintName("fk_AllocationAmounts_fact_PowerTypeCV");

                entity.HasOne(d => d.PrimaryUseCategoryCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.PrimaryUseCategoryCv)
                    .HasConstraintName("FK_AllocationAmounts_BeneficialUses");

                entity.HasOne(d => d.SdwisidentifierCvNavigation)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.SdwisidentifierCv)
                    .HasConstraintName("FK_AllocationAmounts_SDWISIdentifier");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Variables_dim");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.AllocationAmountsFacts)
                    .HasForeignKey(d => d.WaterSourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_WaterSources_dim");
            });

            modelBuilder.Entity<AllocationBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.AllocationBridgeId);

                entity.ToTable("AllocationBridge_BeneficialUses_fact", "Core");

                entity.HasIndex(e => new { e.BeneficialUseCv, e.AllocationAmountId })
                    .HasName("AK_AllocationBridgeBeneficialUses_BeneficialUseCvAllocationAmountId")
                    .IsUnique();

                entity.HasIndex(e => e.AllocationAmountId)
                    .HasName("IX_AllocationBridgeBeneficialUses_AllocationAmountId");

                entity.Property(e => e.AllocationBridgeId).HasColumnName("AllocationBridgeID");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.BeneficialUseCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("BeneficialUseCV");

                entity.HasOne(d => d.AllocationAmount)
                    .WithMany(p => p.AllocationBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.AllocationAmountId)
                    .HasConstraintName("FK_AllocationBridge_BeneficialUses_fact_AllocationAmounts_fact");

                entity.HasOne(d => d.BeneficialUseCvNavigation)
                    .WithMany(p => p.AllocationBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.BeneficialUseCv)
                    .HasConstraintName("FK_AllocationBridge_BeneficialUses");
            });

            modelBuilder.Entity<AllocationBridgeSitesFact>(entity =>
            {
                entity.HasKey(e => e.AllocationBridgeId);

                entity.ToTable("AllocationBridge_Sites_fact", "Core");

                entity.HasIndex(e => new { e.SiteId, e.AllocationAmountId })
                    .HasName("AK_AllocationBridgeSites_SiteIdAllocationAmountId")
                    .IsUnique();

                entity.HasIndex(e => e.AllocationAmountId)
                    .HasName("IX_AllocationBridge_Sites_fact_AllocationAmountID");

                entity.Property(e => e.AllocationBridgeId).HasColumnName("AllocationBridgeID");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.HasOne(d => d.AllocationAmount)
                    .WithMany(p => p.AllocationBridgeSitesFacts)
                    .HasForeignKey(d => d.AllocationAmountId)
                    .HasConstraintName("FK_AllocationBridge_Sites_fact_AllocationAmounts_fact");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.AllocationBridgeSitesFacts)
                    .HasForeignKey(d => d.SiteId)
                    .HasConstraintName("FK_AllocationBridge_Sites");
            });

            modelBuilder.Entity<ApplicableResourceType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.ApplicableResourceType");

                entity.ToTable("ApplicableResourceType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(100);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<AzureSqlmaintenanceLog>(entity =>
            {
                entity.ToTable("AzureSQLMaintenanceLog");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Command)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("command");

                entity.Property(e => e.ExtraInfo)
                    .HasMaxLength(4000)
                    .IsUnicode(false);

                entity.Property(e => e.StatusMessage)
                    .HasMaxLength(1000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<BeneficialUse>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK__Benefici__737584F717AB3CF6");

                entity.ToTable("BeneficialUses", "CVs");

                entity.HasIndex(e => e.Usgscategory)
                    .HasName("IX_BeneficialUses_UsgsCategory");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.Naicscode)
                    .HasMaxLength(250)
                    .HasColumnName("NAICSCode");

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.Usgscategory)
                    .HasMaxLength(250)
                    .HasColumnName("USGSCategory");

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<CoordinateMethod>(entity =>
            {
                entity.HasKey(e => e.Name);

                entity.ToTable("CoordinateMethod", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.Term).HasMaxLength(100);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<CropType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkCropType");

                entity.ToTable("CropType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<CustomerType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK__Customer__737584F747FD2595");

                entity.ToTable("CustomerType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<DataQualityValue>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkDataQualityValue");

                entity.ToTable("DataQualityValue", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(10);

                entity.Property(e => e.Term).HasMaxLength(100);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<DateDim>(entity =>
            {
                entity.HasKey(e => e.DateId)
                    .HasName("pkDate_dim");

                entity.ToTable("Date_dim", "Core");

                entity.HasIndex(e => e.Date)
                    .HasName("AK_Date_Date")
                    .IsUnique();

                entity.Property(e => e.DateId).HasColumnName("DateID");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Year)
                    .HasMaxLength(4)
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<Epsgcode>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkEPSGCode");

                entity.ToTable("EPSGCode", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<GnisfeatureName>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkGNISFeatureName");

                entity.ToTable("GNISFeatureName", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<ImportError>(entity =>
            {
                entity.ToTable("ImportErrors", "Core");

                entity.Property(e => e.Data).IsRequired();

                entity.Property(e => e.RunId)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<IrrigationMethod>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkIrrigationMethod");

                entity.ToTable("IrrigationMethod", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<LegalStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkLegalStatus");

                entity.ToTable("LegalStatus", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<MethodType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkMethodType");

                entity.ToTable("MethodType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<MethodsDim>(entity =>
            {
                entity.HasKey(e => e.MethodId)
                    .HasName("pkMethods_dim");

                entity.ToTable("Methods_dim", "Core");

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.ApplicableResourceTypeCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("ApplicableResourceTypeCV");

                entity.Property(e => e.DataConfidenceValue).HasMaxLength(50);

                entity.Property(e => e.DataCoverageValue).HasMaxLength(100);

                entity.Property(e => e.DataQualityValueCv)
                    .HasMaxLength(50)
                    .HasColumnName("DataQualityValueCV");

                entity.Property(e => e.MethodDescription)
                    .IsRequired()
                    .HasColumnType("text");

                entity.Property(e => e.MethodName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.MethodNemilink)
                    .HasMaxLength(100)
                    .HasColumnName("MethodNEMILink");

                entity.Property(e => e.MethodTypeCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("MethodTypeCV");

                entity.Property(e => e.MethodUuid)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("MethodUUID");

                entity.HasOne(d => d.ApplicableResourceTypeCvNavigation)
                    .WithMany(p => p.MethodsDims)
                    .HasForeignKey(d => d.ApplicableResourceTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Methods_dim_ApplicableResourceType");

                entity.HasOne(d => d.DataQualityValueCvNavigation)
                    .WithMany(p => p.MethodsDims)
                    .HasForeignKey(d => d.DataQualityValueCv)
                    .HasConstraintName("FK_Methods_dim_DataQualityValue");

                entity.HasOne(d => d.MethodTypeCvNavigation)
                    .WithMany(p => p.MethodsDims)
                    .HasForeignKey(d => d.MethodTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Methods_dim_MethodType");
            });

            modelBuilder.Entity<NhdnetworkStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkNHDNetworkStatus");

                entity.ToTable("NHDNetworkStatus", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<Nhdproduct>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkNHDProduct");

                entity.ToTable("NHDProduct", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<OrganizationsDim>(entity =>
            {
                entity.HasKey(e => e.OrganizationId)
                    .HasName("pkOrganizations_dim");

                entity.ToTable("Organizations_dim", "Core");

                entity.HasIndex(e => e.OrganizationUuid)
                    .HasName("AK_Organizations_OrganizationUuid")
                    .IsUnique();

                entity.HasIndex(e => e.State)
                    .HasName("IX_Organizations_State");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.OrganizationContactEmail)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationContactName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationDataMappingUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("OrganizationDataMappingURL");

                entity.Property(e => e.OrganizationName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationPhoneNumber)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationPurview).HasMaxLength(250);

                entity.Property(e => e.OrganizationUuid)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("OrganizationUUID");

                entity.Property(e => e.OrganizationWebsite)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.State)
                    .IsRequired()
                    .HasMaxLength(2);
            });

            modelBuilder.Entity<PowerType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.PowerType");

                entity.ToTable("PowerType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<RegulatoryOverlayDim>(entity =>
            {
                entity.HasKey(e => e.RegulatoryOverlayId)
                    .HasName("pkRegulatoryOverlay_dim");

                entity.ToTable("RegulatoryOverlay_dim", "Core");

                entity.HasIndex(e => e.RegulatoryOverlayUuid)
                    .HasName("IX_RegulatoryOverlay_OverlayUuid")
                    .IsUnique();

                entity.HasIndex(e => e.RegulatoryStatusCv)
                    .HasName("IX_RegulatoryOverlay_RegulatoryStatus");

                entity.HasIndex(e => e.StatutoryEffectiveDate)
                    .HasName("IX_RegulatoryOverlay_StatutoryEffectiveDate");

                entity.HasIndex(e => e.StatutoryEndDate)
                    .HasName("IX_RegulatoryOverlay_StatutoryEndDate");

                entity.Property(e => e.RegulatoryOverlayId).HasColumnName("RegulatoryOverlayID");

                entity.Property(e => e.OversightAgency)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.RegulatoryDescription).IsRequired();

                entity.Property(e => e.RegulatoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.RegulatoryOverlayNativeId)
                    .HasMaxLength(250)
                    .HasColumnName("RegulatoryOverlayNativeID");

                entity.Property(e => e.RegulatoryOverlayTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("RegulatoryOverlayTypeCV");

                entity.Property(e => e.RegulatoryOverlayUuid)
                    .HasMaxLength(250)
                    .HasColumnName("RegulatoryOverlayUUID");

                entity.Property(e => e.RegulatoryStatusCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("RegulatoryStatusCV");

                entity.Property(e => e.RegulatoryStatute).HasMaxLength(500);

                entity.Property(e => e.RegulatoryStatuteLink).HasMaxLength(500);

                entity.Property(e => e.StatutoryEffectiveDate).HasColumnType("date");

                entity.Property(e => e.StatutoryEndDate).HasColumnType("date");

                entity.Property(e => e.WaterSourceTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("WaterSourceTypeCV");

                entity.HasOne(d => d.RegulatoryOverlayTypeCvNavigation)
                    .WithMany(p => p.RegulatoryOverlayDims)
                    .HasForeignKey(d => d.RegulatoryOverlayTypeCv)
                    .HasConstraintName("FK_RegulatoryOverlay_dim_RegulatoryOverlayTypeCV");

                entity.HasOne(d => d.WaterSourceTypeCvNavigation)
                    .WithMany(p => p.RegulatoryOverlayDims)
                    .HasForeignKey(d => d.WaterSourceTypeCv)
                    .HasConstraintName("FK_RegulatoryOverlay_dim_WaterSourceTypeCV");
            });

            modelBuilder.Entity<RegulatoryOverlayType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.RegulatoryOverlayType");

                entity.ToTable("RegulatoryOverlayType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<RegulatoryReportingUnitsFact>(entity =>
            {
                entity.HasKey(e => e.BridgeId)
                    .HasName("PK__Regulato__BEA1F62299B2AD7F");

                entity.ToTable("RegulatoryReportingUnits_fact", "Core");

                entity.HasIndex(e => e.OrganizationId)
                    .HasName("IX_RegulatoryReportingUnits_OrganizationId");

                entity.HasIndex(e => e.RegulatoryOverlayId)
                    .HasName("IX_RegulatoryReportingUnits_RegulatoryOverlayId");

                entity.HasIndex(e => e.ReportingUnitId)
                    .HasName("IX_RegulatoryReportingUnits_ReportingUnitId");

                entity.Property(e => e.BridgeId).HasColumnName("BridgeID");

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.RegulatoryOverlayId).HasColumnName("RegulatoryOverlayID");

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.RegulatoryReportingUnitsFacts)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_Date_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.RegulatoryReportingUnitsFacts)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_Organizations_dim");

                entity.HasOne(d => d.RegulatoryOverlay)
                    .WithMany(p => p.RegulatoryReportingUnitsFacts)
                    .HasForeignKey(d => d.RegulatoryOverlayId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_RegulatoryOverlay_dim");

                entity.HasOne(d => d.ReportingUnit)
                    .WithMany(p => p.RegulatoryReportingUnitsFacts)
                    .HasForeignKey(d => d.ReportingUnitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_ReportingUnits_dim");
            });

            modelBuilder.Entity<RegulatoryStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkRegulatoryStatus");

                entity.ToTable("RegulatoryStatus", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State)
                    .HasMaxLength(2)
                    .IsFixedLength(true);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<ReportYearCv>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportYearCV");

                entity.ToTable("ReportYearCV", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(4)
                    .IsFixedLength(true);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<ReportYearType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportYearType");

                entity.ToTable("ReportYearType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<ReportingUnitType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportingUnitType");

                entity.ToTable("ReportingUnitType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<ReportingUnitsDim>(entity =>
            {
                entity.HasKey(e => e.ReportingUnitId)
                    .HasName("pkReportingUnits_dim");

                entity.ToTable("ReportingUnits_dim", "Core");

                entity.HasIndex(e => e.ReportingUnitTypeCv)
                    .HasName("IX_ReportingUnits_ReportingUnitTypeCv");

                entity.HasIndex(e => e.ReportingUnitUuid)
                    .HasName("IX_ReportingUnits_ReportingUnitUuid");

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.Property(e => e.EpsgcodeCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("EPSGCodeCV");

                entity.Property(e => e.ReportingUnitName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.ReportingUnitNativeId)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("ReportingUnitNativeID");

                entity.Property(e => e.ReportingUnitProductVersion).HasMaxLength(100);

                entity.Property(e => e.ReportingUnitTypeCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("ReportingUnitTypeCV");

                entity.Property(e => e.ReportingUnitUpdateDate).HasColumnType("date");

                entity.Property(e => e.ReportingUnitUuid)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("ReportingUnitUUID");

                entity.Property(e => e.StateCv)
                    .IsRequired()
                    .HasMaxLength(2)
                    .HasColumnName("StateCV");

                entity.HasOne(d => d.EpsgcodeCvNavigation)
                    .WithMany(p => p.ReportingUnitsDims)
                    .HasForeignKey(d => d.EpsgcodeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ReportingUnits_dim_EPSGCode");

                entity.HasOne(d => d.ReportingUnitTypeCvNavigation)
                    .WithMany(p => p.ReportingUnitsDims)
                    .HasForeignKey(d => d.ReportingUnitTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ReportingUnits_dim_ReportingUnitType");

                entity.HasOne(d => d.StateCvNavigation)
                    .WithMany(p => p.ReportingUnitsDims)
                    .HasForeignKey(d => d.StateCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReportingUnits_dim_State");
            });

            modelBuilder.Entity<SchemaVersion>(entity =>
            {
                entity.Property(e => e.Applied).HasColumnType("datetime");

                entity.Property(e => e.ScriptName)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Sdwisidentifier>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK__SDWISIde__737584F7D43E5517");

                entity.ToTable("SDWISIdentifier", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<SiteType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkSiteType");

                entity.ToTable("SiteType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<SiteVariableAmountsFact>(entity =>
            {
                entity.HasKey(e => e.SiteVariableAmountId)
                    .HasName("pkSiteVariableAmounts_fact");

                entity.ToTable("SiteVariableAmounts_fact", "Core");

                entity.HasIndex(e => e.PrimaryUseCategoryCv)
                    .HasName("IX_SiteVariableAmounts_PrimaryUseCategory");

                entity.HasIndex(e => e.SiteId)
                    .HasName("IX_SiteVariableAmounts_SiteID");

                entity.HasIndex(e => e.TimeframeEndId)
                    .HasName("IX_SiteVariableAmounts_TimeframeEndDate");

                entity.HasIndex(e => e.TimeframeStartId)
                    .HasName("IX_SiteVariableAmounts_TimeframeStartDate");

                entity.HasIndex(e => e.VariableSpecificId)
                    .HasName("IX_SiteVariableAmounts_VariableSpecificId");

                entity.Property(e => e.SiteVariableAmountId).HasColumnName("SiteVariableAmountID");

                entity.Property(e => e.AssociatedNativeAllocationIds)
                    .HasMaxLength(500)
                    .HasColumnName("AssociatedNativeAllocationIDs");

                entity.Property(e => e.CommunityWaterSupplySystem).HasMaxLength(250);

                entity.Property(e => e.CropTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CropTypeCV");

                entity.Property(e => e.CustomerTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("CustomerTypeCV");

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.DataPublicationDoi)
                    .HasMaxLength(100)
                    .HasColumnName("DataPublicationDOI");

                entity.Property(e => e.IrrigationMethodCv)
                    .HasMaxLength(100)
                    .HasColumnName("IrrigationMethodCV");

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.PowerGeneratedGwh).HasColumnName("PowerGeneratedGWh");

                entity.Property(e => e.PowerType).HasMaxLength(50);

                entity.Property(e => e.PrimaryUseCategoryCv)
                    .HasMaxLength(100)
                    .HasColumnName("PrimaryUseCategoryCV");

                entity.Property(e => e.ReportYearCv)
                    .HasMaxLength(4)
                    .HasColumnName("ReportYearCV")
                    .IsFixedLength(true);

                entity.Property(e => e.SdwisidentifierCv)
                    .HasMaxLength(100)
                    .HasColumnName("SDWISIdentifierCV");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.Property(e => e.TimeframeEndId).HasColumnName("TimeframeEndID");

                entity.Property(e => e.TimeframeStartId).HasColumnName("TimeframeStartID");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.HasOne(d => d.CropTypeCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.CropTypeCv)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_CropType");

                entity.HasOne(d => d.CustomerTypeCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.CustomerTypeCv)
                    .HasConstraintName("FK_SiteVariableAmounts_CustomerType");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.SiteVariableAmountsFactDataPublicationDates)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_pub");

                entity.HasOne(d => d.IrrigationMethodCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.IrrigationMethodCv)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_IrrigationMethod");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.PowerTypeNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.PowerType)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_PowerTypeCV");

                entity.HasOne(d => d.PrimaryUseCategoryCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.PrimaryUseCategoryCv)
                    .HasConstraintName("FK_SiteVariableAmounts_BeneficialUses");

                entity.HasOne(d => d.ReportYearCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.ReportYearCv)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_ReportYearCV");

                entity.HasOne(d => d.SdwisidentifierCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.SdwisidentifierCv)
                    .HasConstraintName("FK_SiteVariableAmounts_SDWISIdentifier");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Sites_dim");

                entity.HasOne(d => d.TimeframeEnd)
                    .WithMany(p => p.SiteVariableAmountsFactTimeframeEnds)
                    .HasForeignKey(d => d.TimeframeEndId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_end");

                entity.HasOne(d => d.TimeframeStart)
                    .WithMany(p => p.SiteVariableAmountsFactTimeframeStarts)
                    .HasForeignKey(d => d.TimeframeStartId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_start");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Variables_dim");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.SiteVariableAmountsFacts)
                    .HasForeignKey(d => d.WaterSourceId)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_WaterSources_dim");
            });

            modelBuilder.Entity<SitesBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.SiteBridgeId)
                    .HasName("pkSitesBridge_BeneficialUses_fact");

                entity.ToTable("SitesBridge_BeneficialUses_fact", "Core");

                entity.HasIndex(e => new { e.BeneficialUseCv, e.SiteVariableAmountId })
                    .HasName("AK_SiteBridgeBeneficialUses_BeneficialUseCvSiteVariableAmountId")
                    .IsUnique();

                entity.HasIndex(e => e.SiteVariableAmountId)
                    .HasName("IX_SiteBridgeBeneficialUses_SiteVariableAmountId");

                entity.Property(e => e.SiteBridgeId).HasColumnName("SiteBridgeID");

                entity.Property(e => e.BeneficialUseCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("BeneficialUseCV");

                entity.Property(e => e.SiteVariableAmountId).HasColumnName("SiteVariableAmountID");

                entity.HasOne(d => d.BeneficialUseCvNavigation)
                    .WithMany(p => p.SitesBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.BeneficialUseCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SiteBridge_BeneficialUses");

                entity.HasOne(d => d.SiteVariableAmount)
                    .WithMany(p => p.SitesBridgeBeneficialUsesFacts)
                    .HasForeignKey(d => d.SiteVariableAmountId)
                    .HasConstraintName("fk_SitesBridge_BeneficialUses_fact_SiteVariableAmounts_fact");
            });

            modelBuilder.Entity<SitesDim>(entity =>
            {
                entity.HasKey(e => e.SiteId)
                    .HasName("pkSites_dim");

                entity.ToTable("Sites_dim", "Core");

                entity.HasIndex(e => e.SiteUuid)
                    .IsUnique()
                    .HasName("AK_Site_SiteUuid");

                entity.HasIndex(e => e.County)
                    .HasName("IX_Sites_County");

                entity.HasIndex(e => e.Huc12)
                    .HasName("IX_Sites_Huc12");

                entity.HasIndex(e => e.Huc8)
                    .HasName("IX_Sites_Huc8");

                entity.HasIndex(e => e.SiteTypeCv)
                    .HasName("IX_Sites_SiteType");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.Property(e => e.CoordinateAccuracy).HasMaxLength(255);

                entity.Property(e => e.CoordinateMethodCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("CoordinateMethodCV");

                entity.Property(e => e.County).HasMaxLength(20);

                entity.Property(e => e.EpsgcodeCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("EPSGCodeCV");

                entity.Property(e => e.GniscodeCv)
                    .HasMaxLength(250)
                    .HasColumnName("GNISCodeCV");

                entity.Property(e => e.Huc12)
                    .HasMaxLength(20)
                    .HasColumnName("HUC12");

                entity.Property(e => e.Huc8)
                    .HasMaxLength(20)
                    .HasColumnName("HUC8");

                entity.Property(e => e.NhdnetworkStatusCv)
                    .HasMaxLength(50)
                    .HasColumnName("NHDNetworkStatusCV");

                entity.Property(e => e.NhdproductCv)
                    .HasMaxLength(50)
                    .HasColumnName("NHDProductCV");

                entity.Property(e => e.PodorPousite)
                    .HasMaxLength(50)
                    .HasColumnName("PODorPOUSite");

                entity.Property(e => e.SiteName)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.SiteNativeId)
                    .HasMaxLength(50)
                    .HasColumnName("SiteNativeID");

                entity.Property(e => e.SiteTypeCv)
                    .HasMaxLength(100)
                    .HasColumnName("SiteTypeCV");

                entity.Property(e => e.SiteUuid)
                    .HasMaxLength(200)
                    .HasColumnName("SiteUUID");

                entity.Property(e => e.StateCv)
                    .HasMaxLength(2)
                    .HasColumnName("StateCV");

                entity.Property(e => e.UsgssiteId)
                    .HasMaxLength(250)
                    .HasColumnName("USGSSiteID");

                entity.HasOne(d => d.CoordinateMethodCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.CoordinateMethodCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites_dim_CoordinateMethod");

                entity.HasOne(d => d.EpsgcodeCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.EpsgcodeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites_dim_EPSGCode");

                entity.HasOne(d => d.GniscodeCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.GniscodeCv)
                    .HasConstraintName("FK_Sites_dim_GNISFeatureName");

                entity.HasOne(d => d.NhdnetworkStatusCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.NhdnetworkStatusCv)
                    .HasConstraintName("FK_Sites_dim_NHDNetworkStatus");

                entity.HasOne(d => d.NhdproductCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.NhdproductCv)
                    .HasConstraintName("FK_Sites_dim_NHDProduct");

                entity.HasOne(d => d.SiteTypeCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.SiteTypeCv)
                    .HasConstraintName("fk_Sites_dim_SiteType");

                entity.HasOne(d => d.StateCvNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.StateCv)
                    .HasConstraintName("FK_Sites_dim_StateCV");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkState");

                entity.ToTable("State", "CVs");

                entity.Property(e => e.Name).HasMaxLength(2);

                entity.Property(e => e.Definition).HasMaxLength(20);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(100)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State1)
                    .HasMaxLength(10)
                    .HasColumnName("State");

                entity.Property(e => e.Term).HasMaxLength(2);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkUnits");

                entity.ToTable("Units", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<Variable>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkVariable");

                entity.ToTable("Variable", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<VariableSpecific>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkVariableSpecific");

                entity.ToTable("VariableSpecific", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<VariablesDim>(entity =>
            {
                entity.HasKey(e => e.VariableSpecificId)
                    .HasName("pkVariables_dim");

                entity.ToTable("Variables_dim", "Core");

                entity.HasIndex(e => e.VariableCv)
                    .HasName("IX_Variables_Variable");

                entity.HasIndex(e => e.VariableSpecificCv)
                    .HasName("IX_Variables_VariableSpecific");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.AggregationInterval)
                    .HasColumnType("numeric(10, 1)")
                    .HasColumnName("AggregationInterval ");

                entity.Property(e => e.AggregationIntervalUnitCv)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("AggregationIntervalUnitCV ");

                entity.Property(e => e.AggregationStatisticCv)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("AggregationStatisticCV");

                entity.Property(e => e.AmountUnitCv)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("AmountUnitCV");

                entity.Property(e => e.MaximumAmountUnitCv)
                    .HasMaxLength(250)
                    .HasColumnName("MaximumAmountUnitCV");

                entity.Property(e => e.ReportYearStartMonth)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("ReportYearStartMonth ");

                entity.Property(e => e.ReportYearTypeCv)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("ReportYearTypeCV ");

                entity.Property(e => e.VariableCv)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("VariableCV");

                entity.Property(e => e.VariableSpecificCv)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("VariableSpecificCV");

                entity.Property(e => e.VariableSpecificUuid)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("VariableSpecificUUID");

                entity.HasOne(d => d.AggregationIntervalUnitCvNavigation)
                    .WithMany(p => p.VariablesDimAggregationIntervalUnitCvNavigations)
                    .HasForeignKey(d => d.AggregationIntervalUnitCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Units_interval");

                entity.HasOne(d => d.AggregationStatisticCvNavigation)
                    .WithMany(p => p.VariablesDims)
                    .HasForeignKey(d => d.AggregationStatisticCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_AggregationStatistic");

                entity.HasOne(d => d.AmountUnitCvNavigation)
                    .WithMany(p => p.VariablesDimAmountUnitCvNavigations)
                    .HasForeignKey(d => d.AmountUnitCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Units");

                entity.HasOne(d => d.MaximumAmountUnitCvNavigation)
                    .WithMany(p => p.VariablesDimMaximumAmountUnitCvNavigations)
                    .HasForeignKey(d => d.MaximumAmountUnitCv)
                    .HasConstraintName("fk_Variables_dim_Units_max");

                entity.HasOne(d => d.ReportYearTypeCvNavigation)
                    .WithMany(p => p.VariablesDims)
                    .HasForeignKey(d => d.ReportYearTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_ReportYearType");

                entity.HasOne(d => d.VariableCvNavigation)
                    .WithMany(p => p.VariablesDims)
                    .HasForeignKey(d => d.VariableCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Variable");

                entity.HasOne(d => d.VariableSpecificCvNavigation)
                    .WithMany(p => p.VariablesDims)
                    .HasForeignKey(d => d.VariableSpecificCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_VariableSpecific");
            });

            modelBuilder.Entity<WaterAllocationBasis>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterAllocationBasis");

                entity.ToTable("WaterAllocationBasis", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State)
                    .HasMaxLength(2)
                    .IsFixedLength(true);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<WaterAllocationType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterAllocationType");

                entity.ToTable("WaterAllocationType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(250);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State)
                    .HasMaxLength(2)
                    .IsFixedLength(true);

                entity.Property(e => e.Term).HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<WaterQualityIndicator>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterQualityIndicator");

                entity.ToTable("WaterQualityIndicator", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<WaterSourceType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterSourceType");

                entity.ToTable("WaterSourceType", "CVs");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasMaxLength(250)
                    .HasColumnName("SourceVocabularyURI");

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.WaDename)
                    .HasMaxLength(150)
                    .HasColumnName("WaDEName");
            });

            modelBuilder.Entity<WaterSourcesDim>(entity =>
            {
                entity.HasKey(e => e.WaterSourceId)
                    .HasName("pkWaterSources_dim");

                entity.ToTable("WaterSources_dim", "Core");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.Property(e => e.GnisfeatureNameCv)
                    .HasMaxLength(250)
                    .HasColumnName("GNISFeatureNameCV");

                entity.Property(e => e.WaterQualityIndicatorCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("WaterQualityIndicatorCV");

                entity.Property(e => e.WaterSourceName).HasMaxLength(250);

                entity.Property(e => e.WaterSourceNativeId)
                    .HasMaxLength(250)
                    .HasColumnName("WaterSourceNativeID");

                entity.Property(e => e.WaterSourceTypeCv)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("WaterSourceTypeCV");

                entity.Property(e => e.WaterSourceUuid)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasColumnName("WaterSourceUUID");

                entity.HasOne(d => d.GnisfeatureNameCvNavigation)
                    .WithMany(p => p.WaterSourcesDims)
                    .HasForeignKey(d => d.GnisfeatureNameCv)
                    .HasConstraintName("fk_WaterSources_dim_GNISFeatureName");

                entity.HasOne(d => d.WaterQualityIndicatorCvNavigation)
                    .WithMany(p => p.WaterSourcesDims)
                    .HasForeignKey(d => d.WaterQualityIndicatorCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WaterSources_dim_WaterQualityIndicator");

                entity.HasOne(d => d.WaterSourceTypeCvNavigation)
                    .WithMany(p => p.WaterSourcesDims)
                    .HasForeignKey(d => d.WaterSourceTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WaterSources_dim_WaterSourceType");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
