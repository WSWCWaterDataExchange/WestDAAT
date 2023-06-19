using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class DatabaseContext : DbContext
    {
        public DatabaseContext(DatabaseConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly DatabaseConfiguration _configuration;

        [SuppressMessage("Microsoft.Design", "CA2000", Justification = "DbContext has its own using statement")]
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                if (ShouldUseAzureAccessTokenAuth())
                {
                    var connection = new SqlConnection();
                    connection.ConnectionString = _configuration.ConnectionString;
                    connection.AccessToken = GetAzureAccessToken();
                    optionsBuilder.UseSqlServer(connection, x => x.UseNetTopologySuite());
                }
                else
                {
                    optionsBuilder.UseSqlServer(_configuration.ConnectionString, x => x.UseNetTopologySuite());
                }
            }
        }

        public string GetAzureAccessToken()
        {
            var accessToken = new AzureServiceTokenProvider().GetAccessTokenAsync(
                _configuration.AccessTokenDatabaseResource,
                _configuration.AccessTokenDatabaseTenantId
            ).Result;

            return accessToken;
        }

        public bool ShouldUseAzureAccessTokenAuth()
        {
            // If a password is supplied, use sql auth, otherwise use AD Auth
            var containsPassword = _configuration.ConnectionString.Contains("password", StringComparison.InvariantCultureIgnoreCase) ||
               _configuration.ConnectionString.Contains("integrated security", StringComparison.InvariantCultureIgnoreCase);
            return !containsPassword;
        }

        public virtual DbSet<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFact { get; set; }
        public virtual DbSet<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual DbSet<AggregationStatistic> AggregationStatistic { get; set; }
        public virtual DbSet<AllocationAmountsFact> AllocationAmountsFact { get; set; }
        public virtual DbSet<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFact { get; set; }
        public virtual DbSet<AllocationBridgeSitesFact> AllocationBridgeSitesFact { get; set; }
        public virtual DbSet<ApplicableResourceType> ApplicableResourceType { get; set; }
        public virtual DbSet<BeneficialUsesCV> BeneficialUsesCV { get; set; }
        public virtual DbSet<CoordinateMethod> CoordinateMethod { get; set; }
        public virtual DbSet<CropType> CropType { get; set; }
        public virtual DbSet<CustomerType> CustomerType { get; set; }
        public virtual DbSet<SDWISIdentifier> SDWISIdentifier { get; set; }
        public virtual DbSet<DataQualityValue> DataQualityValue { get; set; }
        public virtual DbSet<DateDim> DateDim { get; set; }
        public virtual DbSet<Epsgcode> Epsgcode { get; set; }
        public virtual DbSet<GnisfeatureName> GnisfeatureName { get; set; }
        public virtual DbSet<ImportErrors> ImportErrors { get; set; }
        public virtual DbSet<IrrigationMethod> IrrigationMethod { get; set; }
        public virtual DbSet<LegalStatus> LegalStatus { get; set; }
        public virtual DbSet<MethodType> MethodType { get; set; }
        public virtual DbSet<MethodsDim> MethodsDim { get; set; }
        public virtual DbSet<NhdnetworkStatus> NhdnetworkStatus { get; set; }
        public virtual DbSet<Nhdproduct> Nhdproduct { get; set; }
        public virtual DbSet<OrganizationsDim> OrganizationsDim { get; set; }
        public virtual DbSet<OwnerClassificationCv> OwnerClassificationCv { get; set; }
        public virtual DbSet<PODSiteToPOUSiteFact> PODSiteToPOUSiteFact { get; set; }
        public virtual DbSet<PowerType> PowerType { get; set; }
        public virtual DbSet<RegulatoryOverlayDim> RegulatoryOverlayDim { get; set; }
        public virtual DbSet<RegulatoryOverlayType> RegulatoryOverlayType { get; set; }
        public virtual DbSet<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFact { get; set; }
        public virtual DbSet<RegulatoryOverlayBridgeSitesFact> RegulatoryOverlayBridgeSitesFact { get; set; }
        public virtual DbSet<RegulatoryStatus> RegulatoryStatus { get; set; }
        public virtual DbSet<ReportYearCv> ReportYearCv { get; set; }
        public virtual DbSet<ReportYearType> ReportYearType { get; set; }
        public virtual DbSet<ReportingUnitType> ReportingUnitType { get; set; }
        public virtual DbSet<ReportingUnitsDim> ReportingUnitsDim { get; set; }
        public virtual DbSet<SiteType> SiteType { get; set; }
        public virtual DbSet<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
        public virtual DbSet<SitesBridgeBeneficialUsesFact> SitesBridgeBeneficialUsesFact { get; set; }
        public virtual DbSet<SitesDim> SitesDim { get; set; }
        public virtual DbSet<State> State { get; set; }
        public virtual DbSet<TempUuid> TempUuid { get; set; }
        public virtual DbSet<TempId> TempId { get; set; }
        public virtual DbSet<Units> Units { get; set; }
        public virtual DbSet<Variable> Variable { get; set; }
        public virtual DbSet<VariableSpecific> VariableSpecific { get; set; }
        public virtual DbSet<VariablesDim> VariablesDim { get; set; }
        public virtual DbSet<WaterAllocationBasis> WaterAllocationBasis { get; set; }
        public virtual DbSet<WaterAllocationType> WaterAllocationType { get; set; }
        public virtual DbSet<WaterQualityIndicator> WaterQualityIndicator { get; set; }
        public virtual DbSet<WaterSourceBridgeSitesFact> WaterSourceBridgeSitesFact { get; set; }
        public virtual DbSet<WaterSourceType> WaterSourceType { get; set; }
        public virtual DbSet<WaterSourcesDim> WaterSourcesDim { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<AggBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.AggBridgeId)
                    .HasName("pkAggBridge_BeneficialUses_fact");

                entity.ToTable("AggBridge_BeneficialUses_fact", "Core");

                entity.Property(e => e.AggBridgeId).HasColumnName("AggBridgeID");

                entity.Property(e => e.AggregatedAmountId).HasColumnName("AggregatedAmountID");

                entity.Property(e => e.BeneficialUseCV).HasColumnName("BeneficialUseCV");

                entity.HasOne(d => d.AggregatedAmount)
                    .WithMany(p => p.AggBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.AggregatedAmountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggBridge_BeneficialUses_fact_AggregatedAmounts_fact");

                entity.HasOne(d => d.BeneficialUse)
                    .WithMany(p => p.AggBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.BeneficialUseCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggBridge_BeneficialUses_fact_BeneficialUses");
            });

            modelBuilder.Entity<TempUuid>(entity =>
            {
                entity.HasNoKey();

                // this only works for a single temp table during a command
                entity.ToTable("#TempUuid");
            });

            modelBuilder.Entity<TempId>(entity =>
            {
                entity.HasNoKey();

                // this only works for a single temp table during a command
                entity.ToTable("#TempId");
            });

            modelBuilder.Entity<AggregatedAmountsFact>(entity =>
            {
                entity.HasKey(e => e.AggregatedAmountId)
                    .HasName("pkAggregatedAmounts_fact");

                entity.ToTable("AggregatedAmounts_fact", "Core");

                entity.Property(e => e.AggregatedAmountId).HasColumnName("AggregatedAmountID");

                entity.Property(e => e.PrimaryUseCategoryCV).HasColumnName("PrimaryBeneficialUseCategory");

                entity.Property(e => e.DataPublicationDoi)
                    .HasColumnName("DataPublicationDOI")
                    .HasMaxLength(100);

                entity.Property(e => e.InterbasinTransferFromId)
                    .HasColumnName("InterbasinTransferFromID")
                    .HasMaxLength(100);

                entity.Property(e => e.InterbasinTransferToId)
                    .HasColumnName("InterbasinTransferToID")
                    .HasMaxLength(100);

                ////////////////////////////////////////////////
                entity.Property(e => e.CropTypeCV)
                   .HasColumnName("CropTypeCV")
                   .HasMaxLength(100);

                entity.Property(e => e.CustomerTypeCV)
                   .HasColumnName("CustomerTypeCV")
                   .HasMaxLength(100);

                entity.Property(e => e.IrrigationMethodCV)
                   .HasColumnName("IrrigationMethodCV")
                   .HasMaxLength(100);

                entity.Property(e => e.SDWISIdentifierCV)
                   .HasColumnName("SDWISIdentifierCV")
                   .HasMaxLength(100);

                entity.Property(e => e.CommunityWaterSupplySystem)
                  .HasColumnName("CommunityWaterSupplySystem")
                  .HasMaxLength(250);

                entity.Property(e => e.PowerType)
                    .HasColumnName("PowerType")
                    .HasMaxLength(50);

                entity.Property(e => e.TimeframeEndId).HasColumnName("TimeframeStartID");

                entity.Property(e => e.TimeframeStartId).HasColumnName("TimeframeEndID");

                entity.Property(e => e.IrrigatedAcreage).HasColumnName("IrrigatedAcreage");

                entity.Property(e => e.DataPublicationDateID).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.Amount).HasColumnName("Amount");

                entity.Property(e => e.PopulationServed).HasColumnName("PopulationServed");

                entity.Property(e => e.AllocationCropDutyAmount).HasColumnName("AllocationCropDutyAmount");

                //////////////////////////////////////////////////

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.PowerGeneratedGwh).HasColumnName("PowerGeneratedGWh");

                entity.Property(e => e.ReportYearCv)
                    .HasColumnName("ReportYearCV")
                    .HasMaxLength(4);

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.Property(e => e.TimeframeEndId).HasColumnName("TimeframeEndID");

                entity.Property(e => e.TimeframeStartId).HasColumnName("TimeframeStartID");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.HasOne(d => d.PrimaryBeneficialUse)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.PrimaryUseCategoryCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_BeneficialUses");

                entity.HasOne(d => d.DataPublicationDateNavigation)
                    .WithMany(p => p.AggregatedAmountsFactDataPublicationDateNavigation)
                    .HasForeignKey(d => d.DataPublicationDateID)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_end_pub");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.ReportYearCvNavigation)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.ReportYearCv)
                    .HasConstraintName("fk_AggregatedAmounts_fact_ReportYearCV");

                entity.HasOne(d => d.ReportingUnit)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.ReportingUnitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_ReportingUnits_dim");

                entity.HasOne(d => d.TimeframeEnd)
                    .WithMany(p => p.AggregatedAmountsFactTimeframeEnd)
                    .HasForeignKey(d => d.TimeframeEndId)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_end");

                entity.HasOne(d => d.TimeframeStart)
                    .WithMany(p => p.AggregatedAmountsFactTimeframeStart)
                    .HasForeignKey(d => d.TimeframeStartId)
                    .HasConstraintName("fk_AggregatedAmounts_Date_dim_start");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_Variables_dim");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.WaterSourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_WaterSources_dim");


                entity.HasOne(d => d.CropType)
                  .WithMany(p => p.AggregatedAmountsFact)
                  .HasForeignKey(d => d.CropTypeCV)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("fk_AggregatedAmounts_fact_CropType");

                entity.HasOne(d => d.IrrigationMethod)
                       .WithMany(p => p.AggregatedAmountsFact)
                       .HasForeignKey(d => d.IrrigationMethodCV)
                       .HasConstraintName("fk_AggregatedAmounts_fact_IrrigationMethod");

                entity.HasOne(d => d.CustomerType)
                       .WithMany(p => p.AggregatedAmountsFact)
                       .HasForeignKey(d => d.CustomerTypeCV)
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("fk_AggregatedAmounts_CustomerType");

                entity.HasOne(d => d.SDWISIdentifier)
                       .WithMany(p => p.AggregatedAmountsFact)
                       .HasForeignKey(d => d.SDWISIdentifierCV)
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("fk_AggregatedAmounts_fact_SDWISIdentifier");

                entity.HasOne(d => d.PowerTypeCV)
                    .WithMany(p => p.AggregatedAmountsFact)
                    .HasForeignKey(d => d.PowerType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AggregatedAmounts_fact_PowerTypeCV");
            });

            modelBuilder.Entity<AggregationStatistic>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkAggregationStatistic");

                entity.ToTable("AggregationStatistic", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<AllocationAmountsFact>(entity =>
            {
                entity.HasKey(e => e.AllocationAmountId)
                    .HasName("pkAllocationAmounts_fact");

                entity.ToTable("AllocationAmounts_fact", "Core");

                entity.Property(e => e.AllocationUuid).HasColumnName("AllocationUUID");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.AllocationAssociatedConsumptiveUseSiteIds)
                    .HasColumnName("AllocationAssociatedConsumptiveUseSiteIDs")
                    .HasMaxLength(500);

                entity.Property(e => e.AllocationAssociatedWithdrawalSiteIds)
                    .HasColumnName("AllocationAssociatedWithdrawalSiteIDs")
                    .HasMaxLength(500);

                entity.Property(e => e.AllocationBasisCv)
                    .HasColumnName("AllocationBasisCV")
                    .HasMaxLength(250);

                entity.Property(e => e.AllocationChangeApplicationIndicator).HasMaxLength(100);

                entity.Property(e => e.AllocationCommunityWaterSupplySystem).HasMaxLength(250);

                entity.Property(e => e.AllocationLegalStatusCv)
                    .HasColumnName("AllocationLegalStatusCV")
                    .HasMaxLength(250);

                entity.Property(e => e.AllocationNativeId)
                    .HasColumnName("AllocationNativeID")
                    .HasMaxLength(250);

                entity.Property(e => e.AllocationOwner).HasMaxLength(250);

                entity.Property(e => e.SdwisidentifierCV)
                    .HasColumnName("SDWISIdentifierCV")
                    .HasMaxLength(100);

                entity.Property(e => e.AllocationTypeCv)
                    .HasColumnName("AllocationTypeCV")
                    .HasMaxLength(250);

                entity.Property(e => e.OwnerClassificationCV)
                    .HasColumnName("OwnerClassificationCV")
                    .HasMaxLength(250);

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                //////////////////////////////////////////////////////////////////////////////
                entity.Property(e => e.AllocationApplicationDateID).HasColumnName("AllocationApplicationDateID");
                entity.Property(e => e.AllocationPriorityDateID).HasColumnName("AllocationPriorityDateID");
                entity.Property(e => e.AllocationExpirationDateID).HasColumnName("AllocationExpirationDateID");
                entity.Property(e => e.AllocationTimeframeStart).HasColumnName("AllocationTimeframeStart");
                entity.Property(e => e.AllocationCropDutyAmount).HasColumnName("AllocationCropDutyAmount");
                entity.Property(e => e.AllocationFlow_CFS).HasColumnName("AllocationFlow_CFS");
                entity.Property(e => e.AllocationVolume_AF).HasColumnName("AllocationVolume_AF");
                entity.Property(e => e.PopulationServed).HasColumnName("PopulationServed");
                entity.Property(e => e.IrrigatedAcreage).HasColumnName("IrrigatedAcreage");
                entity.Property(e => e.AllocationCommunityWaterSupplySystem).HasColumnName("AllocationCommunityWaterSupplySystem");
                entity.Property(e => e.AllocationTimeframeEnd).HasColumnName("AllocationTimeframeEnd");
                entity.Property(e => e.AllocationChangeApplicationIndicator).HasColumnName("AllocationChangeApplicationIndicator");
                entity.Property(e => e.ExemptOfVolumeFlowPriority).HasColumnName("ExemptOfVolumeFlowPriority");
                entity.Property(e => e.AllocationOwner)
                    .HasColumnName("AllocationOwner")
                    .HasMaxLength(250);

                entity.Property(e => e.AllocationTypeCv)
                   .HasColumnName("AllocationTypeCV")
                   .HasMaxLength(250);

                entity.Property(e => e.CommunityWaterSupplySystem).HasColumnName("CommunityWaterSupplySystem").HasMaxLength(250);
                entity.Property(e => e.CropTypeCV)
                                  .HasColumnName("CropTypeCV")
                                  .HasMaxLength(100);

                entity.Property(e => e.CustomerTypeCV)
                   .HasColumnName("CustomerTypeCV")
                   .HasMaxLength(100);
                entity.Property(e => e.IrrigationMethodCV)
                                   .HasColumnName("IrrigationMethodCV")
                                   .HasMaxLength(100);

                entity.Property(e => e.PowerType)
                    .HasColumnName("PowerType")
                    .HasMaxLength(50);

                ///////////////////////////////////////////////////////////////////////////////

                entity.Property(e => e.DataPublicationDoi)
                    .HasColumnName("DataPublicationDOI")
                    .HasMaxLength(100);

                entity.Property(e => e.LegacyAllocationIds)
                    .HasColumnName("LegacyAllocationIDs")
                    .HasMaxLength(250);

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.GeneratedPowerCapacityMW).HasColumnName("GeneratedPowerCapacityMW");

                entity.Property(e => e.PrimaryBeneficialUseCategory).HasColumnName("PrimaryBeneficialUseCategory");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterAllocationNativeUrl)
                    .HasColumnName("WaterAllocationNativeURL")
                    .HasMaxLength(250);

                entity.HasOne(d => d.AllocationApplicationDateNavigation)
                    .WithMany(p => p.AllocationAmountsFactAllocationApplicationDateNavigation)
                    .HasForeignKey(d => d.AllocationApplicationDateID)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_appl");

                entity.HasOne(d => d.AllocationBasisCvNavigation)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.AllocationBasisCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_WaterAllocationBasis");

                entity.HasOne(d => d.AllocationExpirationDateNavigation)
                    .WithMany(p => p.AllocationAmountsFactAllocationExpirationDateNavigation)
                    .HasForeignKey(d => d.AllocationExpirationDateID)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_expir");

                entity.HasOne(d => d.AllocationLegalStatusCvNavigation)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.AllocationLegalStatusCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_LegalStatus");

                entity.HasOne(d => d.AllocationPriorityDateNavigation)
                    .WithMany(p => p.AllocationAmountsFactAllocationPriorityDateNavigation)
                    .HasForeignKey(d => d.AllocationPriorityDateID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_priority");

                entity.HasOne(d => d.AllocationTypeCvNavigation)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.AllocationTypeCv)
                    .HasConstraintName("fk_AllocationAmounts_fact_WaterRightType");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.AllocationAmountsFactDataPublicationDate)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Date_dim_pub");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_Variables_dim");

                entity.HasOne(d => d.CropType)
                   .WithMany(p => p.AllocationAmountsFact)
                   .HasForeignKey(d => d.CropTypeCV)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("fk_AllocationAmounts_fact_CropType");

                entity.HasOne(d => d.IrrigationMethod)
                       .WithMany(p => p.AllocationAmountsFact)
                       .HasForeignKey(d => d.IrrigationMethodCV)
                       .HasConstraintName("fk_AllocationAmounts_fact_IrrigationMethod");

                entity.HasOne(d => d.CustomerType)
                       .WithMany(p => p.AllocationAmountsFact)
                       .HasForeignKey(d => d.CustomerTypeCV)
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("fk_AllocationAmounts_CustomerType");

                entity.HasOne(d => d.SDWISIdentifier)
                       .WithMany(p => p.AllocationAmountsFact)
                       .HasForeignKey(d => d.SdwisidentifierCV)
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("fk_AllocationAmounts_fact_SDWISIdentifier");

                entity.HasOne(d => d.PowerTypeCV)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.PowerType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_AllocationAmounts_fact_PowerTypeCV");

                entity.HasOne(d => d.OwnerClassification)
                    .WithMany(p => p.AllocationAmountsFact)
                    .HasForeignKey(d => d.OwnerClassificationCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AllocationAmounts_OwnerClassification");
            });

            modelBuilder.Entity<AllocationBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.AllocationBridgeId);

                entity.ToTable("AllocationBridge_BeneficialUses_fact", "Core");

                entity.Property(e => e.AllocationBridgeId).HasColumnName("AllocationBridgeID");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.BeneficialUseCV).HasColumnName("BeneficialUseCV");

                entity.HasOne(d => d.AllocationAmount)
                    .WithMany(p => p.AllocationBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.AllocationAmountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AllocationBridge_BeneficialUses_fact_AllocationAmounts_fact");

                entity.HasOne(d => d.BeneficialUse)
                    .WithMany(p => p.AllocationBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.BeneficialUseCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AllocationBridge_BeneficialUses_fact_BeneficialUses");
            });

            modelBuilder.Entity<AllocationBridgeSitesFact>(entity =>
            {
                entity.HasKey(e => e.AllocationBridgeId);

                entity.ToTable("AllocationBridge_Sites_fact", "Core");

                entity.Property(e => e.AllocationBridgeId).HasColumnName("AllocationBridgeID");

                entity.Property(e => e.AllocationAmountId).HasColumnName("AllocationAmountID");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.HasOne(d => d.AllocationAmount)
                    .WithMany(p => p.AllocationBridgeSitesFact)
                    .HasForeignKey(d => d.AllocationAmountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AllocationBridge_Sites_fact_AllocationAmounts_fact");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.AllocationBridgeSitesFact)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AllocationBridge_Sites");
            });

            modelBuilder.Entity<ApplicableResourceType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.ApplicableResourceType");

                entity.ToTable("ApplicableResourceType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(100);
            });

            modelBuilder.Entity<BeneficialUsesCV>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK__Benefici__737584F7133E924E");

                entity.ToTable("BeneficialUses", "CVs");



                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Term)
                    .HasColumnName("Term")
                    .HasMaxLength(100);

                entity.Property(e => e.Definition)
                    .HasColumnName("Definition")
                    .HasMaxLength(100);

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.UsgscategoryNameCv)
                    .HasColumnName("USGSCategory")
                    .HasMaxLength(100);
                entity.Property(e => e.NaicscodeNameCv)
                   .HasColumnName("NAICSCode")
                   .HasMaxLength(100);
                entity.Property(e => e.SourceVocabularyURI)
                   .HasColumnName("SourceVocabularyURI")
                   .HasMaxLength(100);

                entity.Property(e => e.ConsumptionCategoryType)
                    .HasColumnName("ConsumptionCategoryType");


            });

            modelBuilder.Entity<CoordinateMethod>(entity =>
            {
                entity.HasKey(e => e.Name);

                entity.ToTable("CoordinateMethod", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.Term).HasMaxLength(100);
            });

            modelBuilder.Entity<CropType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkCropType");

                entity.ToTable("CropType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<CustomerType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkcustomerType");

                entity.ToTable("CustomerType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<SDWISIdentifier>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pksdwisIdentifier");

                entity.ToTable("SDWISIdentifier", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<DataQualityValue>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkDataQualityValue");

                entity.ToTable("DataQualityValue", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(10);

                entity.Property(e => e.Term).HasMaxLength(100);
            });

            modelBuilder.Entity<DateDim>(entity =>
            {
                entity.HasKey(e => e.DateId)
                    .HasName("pkDate_dim");

                entity.ToTable("Date_dim", "Core");

                entity.Property(e => e.DateId).HasColumnName("DateID");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Year).HasMaxLength(4);
            });

            modelBuilder.Entity<Epsgcode>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkEPSGCode");

                entity.ToTable("EPSGCode", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<GnisfeatureName>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkGNISFeatureName");

                entity.ToTable("GNISFeatureName", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ImportErrors>(entity =>
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

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<LegalStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkLegalStatus");

                entity.ToTable("LegalStatus", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<MethodType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkMethodType");

                entity.ToTable("MethodType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<MethodsDim>(entity =>
            {
                entity.HasKey(e => e.MethodId)
                    .HasName("pkMethods_dim");

                entity.ToTable("Methods_dim", "Core");

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                entity.Property(e => e.ApplicableResourceTypeCv)
                    .IsRequired()
                    .HasColumnName("ApplicableResourceTypeCV")
                    .HasMaxLength(100);

                entity.Property(e => e.DataConfidenceValue).HasMaxLength(50);

                entity.Property(e => e.DataCoverageValue).HasMaxLength(100);

                entity.Property(e => e.DataQualityValueCv)
                    .HasColumnName("DataQualityValueCV")
                    .HasMaxLength(50);

                entity.Property(e => e.MethodDescription)
                    .IsRequired()
                    .HasColumnType("text");

                entity.Property(e => e.MethodName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.MethodNemilink)
                    .HasColumnName("MethodNEMILink")
                    .HasMaxLength(100);

                entity.Property(e => e.MethodTypeCv)
                    .IsRequired()
                    .HasColumnName("MethodTypeCV")
                    .HasMaxLength(50);

                entity.Property(e => e.MethodUuid)
                    .IsRequired()
                    .HasColumnName("MethodUUID")
                    .HasMaxLength(100);

                entity.Property(e => e.WaDEDataMappingUrl)
                    .IsRequired()
                    .HasColumnName("WaDEDataMappingURL")
                    .HasMaxLength(250);

                entity.HasOne(d => d.ApplicableResourceTypeCvNavigation)
                    .WithMany(p => p.MethodsDim)
                    .HasForeignKey(d => d.ApplicableResourceTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Methods_dim_ApplicableResourceType");

                entity.HasOne(d => d.DataQualityValueCvNavigation)
                    .WithMany(p => p.MethodsDim)
                    .HasForeignKey(d => d.DataQualityValueCv)
                    .HasConstraintName("FK_Methods_dim_DataQualityValue");

                entity.HasOne(d => d.MethodTypeCvNavigation)
                    .WithMany(p => p.MethodsDim)
                    .HasForeignKey(d => d.MethodTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Methods_dim_MethodType");
            });

            //modelBuilder.Entity<Naicscode>(entity =>
            //{
            //    entity.HasKey(e => e.Name)
            //        .HasName("pkNAICSCode");

            //    entity.ToTable("NAICSCode", "CVs");

            //    entity.Property(e => e.Name)
            //        .HasMaxLength(250)
            //        .ValueGeneratedNever();

            //    entity.Property(e => e.SourceVocabularyUri)
            //        .HasColumnName("SourceVocabularyURI")
            //        .HasMaxLength(250);

            //    entity.Property(e => e.State).HasMaxLength(250);

            //    entity.Property(e => e.Term)
            //        .IsRequired()
            //        .HasMaxLength(250);
            //});

            modelBuilder.Entity<NhdnetworkStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkNHDNetworkStatus");

                entity.ToTable("NHDNetworkStatus", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<Nhdproduct>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkNHDProduct");

                entity.ToTable("NHDProduct", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<OrganizationsDim>(entity =>
            {
                entity.HasKey(e => e.OrganizationId)
                    .HasName("pkOrganizations_dim");

                entity.ToTable("Organizations_dim", "Core");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.OrganizationContactEmail)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationContactName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationPhoneNumber)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.OrganizationPurview).HasMaxLength(250);

                entity.Property(e => e.OrganizationUuid)
                    .IsRequired()
                    .HasColumnName("OrganizationUUID")
                    .HasMaxLength(250);

                entity.Property(e => e.State)
                   .IsRequired()
                   .HasColumnName("State")
                   .HasMaxLength(2);

                entity.Property(e => e.OrganizationWebsite)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<OwnerClassificationCv>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.OwnerClassification");

                entity.ToTable("OwnerClassification", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyURI)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<PowerType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.PowerType");

                entity.ToTable("PowerType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<RegulatoryOverlayDim>(entity =>
            {
                entity.HasKey(e => e.RegulatoryOverlayId)
                    .HasName("pkRegulatoryOverlay_dim");

                entity.ToTable("RegulatoryOverlay_dim", "Core");

                entity.Property(e => e.RegulatoryOverlayId).HasColumnName("RegulatoryOverlayID");

                entity.Property(e => e.OversightAgency)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.RegulatoryDescription).IsRequired();

                entity.Property(e => e.RegulatoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.RegulatoryOverlayNativeId)
                    .HasColumnName("RegulatoryOverlayNativeID")
                    .HasMaxLength(250);

                entity.Property(e => e.RegulatoryOverlayUuid)
                    .HasColumnName("RegulatoryOverlayUUID")
                    .HasMaxLength(250);

                entity.Property(e => e.RegulatoryStatusCv)
                    .IsRequired()
                    .HasColumnName("RegulatoryStatusCV")
                    .HasMaxLength(50);

                entity.Property(e => e.RegulatoryOverlayTypeCV)
                    .HasColumnName("RegulatoryOverlayTypeCV")
                    .HasMaxLength(100);

                entity.Property(e => e.WaterSourceTypeCV)
                    .HasColumnName("WaterSourceTypeCV")
                    .HasMaxLength(100);

                entity.HasOne(d => d.WaterSourceType)
                    .WithMany(p => p.RegulatoryOverlayDim)
                    .HasForeignKey(d => d.WaterSourceTypeCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RegulatoryOverlay_dim_WaterSourceTypeCV");

                entity.HasOne(d => d.RegulatoryOverlayType)
                    .WithMany(p => p.RegulatoryOverlayDim)
                    .HasForeignKey(d => d.RegulatoryOverlayTypeCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RegulatoryOverlay_dim_RegulatoryOverlayTypeCV");

                entity.Property(e => e.RegulatoryStatute).HasMaxLength(500);

                entity.Property(e => e.RegulatoryStatuteLink).HasMaxLength(500);

                entity.Property(e => e.StatutoryEffectiveDate).HasColumnType("date");

                entity.Property(e => e.StatutoryEndDate).HasColumnType("date");
            });

            modelBuilder.Entity<RegulatoryOverlayType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK_CVs.RegulatoryOverlayType");

                entity.ToTable("RegulatoryOverlayType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<RegulatoryReportingUnitsFact>(entity =>
            {
                entity.HasKey(e => e.BridgeId)
                    .HasName("pkRegulatoryReportingUnits_fact");

                entity.ToTable("RegulatoryReportingUnits_fact", "Core");

                entity.Property(e => e.BridgeId)
                    .HasColumnName("BridgeID");

                entity.Property(e => e.DataPublicationDateId).HasColumnName("DataPublicationDateID");

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.RegulatoryOverlayId).HasColumnName("RegulatoryOverlayID");

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.HasOne(d => d.DataPublicationDate)
                    .WithMany(p => p.RegulatoryReportingUnitsFact)
                    .HasForeignKey(d => d.DataPublicationDateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_Date_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.RegulatoryReportingUnitsFact)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_Organizations_dim");

                entity.HasOne(d => d.RegulatoryOverlay)
                    .WithMany(p => p.RegulatoryReportingUnitsFact)
                    .HasForeignKey(d => d.RegulatoryOverlayId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_RegulatoryOverlay_dim");

                entity.HasOne(d => d.ReportingUnit)
                    .WithMany(p => p.RegulatoryReportingUnitsFact)
                    .HasForeignKey(d => d.ReportingUnitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryReportingUnits_fact_ReportingUnits_dim");
            });

            modelBuilder.Entity<RegulatoryOverlayBridgeSitesFact>(entity =>
            {
                entity.HasKey(e => e.RegulatoryOverlayBridgeId);

                entity.ToTable("RegulatoryOverlayBridge_Sites_fact", "Core");

                entity.Property(e => e.RegulatoryOverlayBridgeId).HasColumnName("RegulatoryOverlayBridgeID");

                entity.Property(e => e.RegulatoryOverlayId).HasColumnName("RegulatoryOverlayID");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.HasOne(d => d.RegulatoryOverlay)
                    .WithMany(p => p.RegulatoryOverlayBridgeSitesFact)
                    .HasForeignKey(d => d.RegulatoryOverlayId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryOverLayBridge_Sites_fact_RegulatoryOverlay_fact");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.RegulatoryOverlayBridgeSitesFact)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_RegulatoryOverLayBridge_Sites_fact_Sites_dim");
            });

            modelBuilder.Entity<RegulatoryStatus>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkRegulatoryStatus");

                entity.ToTable("RegulatoryStatus", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(2);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ReportYearCv>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportYearCV");

                entity.ToTable("ReportYearCV", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(4)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ReportYearType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportYearType");

                entity.ToTable("ReportYearType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ReportingUnitType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkReportingUnitType");

                entity.ToTable("ReportingUnitType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ReportingUnitsDim>(entity =>
            {
                entity.HasKey(e => e.ReportingUnitId)
                    .HasName("pkReportingUnits_dim");

                entity.ToTable("ReportingUnits_dim", "Core");

                entity.Property(e => e.ReportingUnitId).HasColumnName("ReportingUnitID");

                entity.Property(e => e.EpsgcodeCv)
                    .IsRequired()
                    .HasColumnName("EPSGCodeCV")
                    .HasMaxLength(50);

                entity.Property(e => e.Geometry).HasColumnType("geometry");

                entity.Property(e => e.ReportingUnitName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.ReportingUnitNativeId)
                    .IsRequired()
                    .HasColumnName("ReportingUnitNativeID")
                    .HasMaxLength(250);

                entity.Property(e => e.ReportingUnitProductVersion).HasMaxLength(100);

                entity.Property(e => e.ReportingUnitTypeCv)
                    .IsRequired()
                    .HasColumnName("ReportingUnitTypeCV")
                    .HasMaxLength(50);

                entity.Property(e => e.ReportingUnitUpdateDate).HasColumnType("date");

                entity.Property(e => e.ReportingUnitUuid)
                    .IsRequired()
                    .HasColumnName("ReportingUnitUUID")
                    .HasMaxLength(250);

                entity.Property(e => e.StateCv)
                    .IsRequired()
                    .HasColumnName("StateCV")
                    .HasMaxLength(2);

                entity.HasOne(d => d.EpsgcodeCvNavigation)
                    .WithMany(p => p.ReportingUnitsDim)
                    .HasForeignKey(d => d.EpsgcodeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ReportingUnits_dim_EPSGCode");

                entity.HasOne(d => d.ReportingUnitTypeCvNavigation)
                    .WithMany(p => p.ReportingUnitsDim)
                    .HasForeignKey(d => d.ReportingUnitTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ReportingUnits_dim_ReportingUnitType");

                entity.HasOne(d => d.StateCvNavigation)
                    .WithMany(p => p.ReportingUnitsDim)
                    .HasForeignKey(d => d.StateCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReportingUnits_dim_State");
            });

            modelBuilder.Entity<SiteType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkSiteType");

                entity.ToTable("SiteType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<SiteVariableAmountsFact>(entity =>
            {
                entity.HasKey(e => e.SiteVariableAmountId)
                    .HasName("pkSiteVariableAmounts_fact");

                entity.ToTable("SiteVariableAmounts_fact", "Core");

                entity.Property(e => e.SiteVariableAmountId).HasColumnName("SiteVariableAmountID");

                entity.Property(e => e.AssociatedNativeAllocationIds)
                    .HasColumnName("AssociatedNativeAllocationIDs")
                    .HasMaxLength(500);

                entity.Property(e => e.CommunityWaterSupplySystem).HasColumnName("CommunityWaterSupplySystem").HasMaxLength(250);

                entity.Property(e => e.CropTypeCv)
                    .HasColumnName("CropTypeCV")
                    .HasMaxLength(100);



                entity.Property(e => e.CustomerTypeCv)
                   .HasColumnName("CustomerTypeCV")
                   .HasMaxLength(100);

                entity.Property(e => e.SDWISIdentifierCv)
                   .HasColumnName("SDWISIdentifierCv")
                   .HasMaxLength(100);

                entity.Property(e => e.DataPublicationDoi)
                    .HasColumnName("DataPublicationDOI")
                    .HasMaxLength(100);

                entity.Property(e => e.Geometry).HasColumnType("geometry");

                entity.Property(e => e.IrrigationMethodCv)
                    .HasColumnName("IrrigationMethodCV")
                    .HasMaxLength(100);

                entity.Property(e => e.PowerType)
                    .HasColumnName("PowerType")
                    .HasMaxLength(50);

                entity.Property(e => e.MethodId).HasColumnName("MethodID");

                ///////////////////////////////////////////////////////////////
                entity.Property(e => e.TimeframeEndID).HasColumnName("TimeFrameEndID");
                entity.Property(e => e.TimeframeStartID).HasColumnName("TimeFrameStartID");
                entity.Property(e => e.DataPublicationDateID).HasColumnName("DataPublicationDateID");
                entity.Property(e => e.Amount).HasColumnName("Amount");
                entity.Property(e => e.PopulationServed).HasColumnName("PopulationServed");
                entity.Property(e => e.IrrigatedAcreage).HasColumnName("IrrigatedAcreage");
                entity.Property(e => e.AllocationCropDutyAmount).HasColumnName("AllocationCropDutyAmount");
                //////////////////////////////////////////////////////////////

                entity.Property(e => e.OrganizationId).HasColumnName("OrganizationID");

                entity.Property(e => e.PowerGeneratedGwh).HasColumnName("PowerGeneratedGWh");

                entity.Property(e => e.ReportYearCv)
                    .HasColumnName("ReportYearCV")
                    .HasMaxLength(4);

                entity.Property(e => e.PrimaryUseCategoryCV)
                   .HasColumnName("PrimaryUseCategoryCV")
                   .HasMaxLength(100);

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.HasOne(d => d.PrimaryBeneficialUse)
                  .WithMany(p => p.SiteVariableAmountsFact)
                  .HasForeignKey(d => d.PrimaryUseCategoryCV)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("fk_SiteVariableAmounts_BeneficialUses");

                entity.HasOne(d => d.CropTypeCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.CropTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_CropType");

                entity.HasOne(d => d.DataPublicationDateNavigation)
                    .WithMany(p => p.SiteVariableAmountsFactDataPublicationDateNavigation)
                    .HasForeignKey(d => d.DataPublicationDateID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_pub");

                entity.HasOne(d => d.IrrigationMethodCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.IrrigationMethodCv)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_IrrigationMethod");

                entity.HasOne(d => d.Method)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.MethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Methods_dim");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Organizations_dim");

                entity.HasOne(d => d.ReportYearCvNavigation)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.ReportYearCv)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_ReportYearCV");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Sites_dim");

                entity.HasOne(d => d.TimeframeEndNavigation)
                    .WithMany(p => p.SiteVariableAmountsFactTimeframeEndNavigation)
                    .HasForeignKey(d => d.TimeframeEndID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_end");

                entity.HasOne(d => d.TimeframeStartNavigation)
                    .WithMany(p => p.SiteVariableAmountsFactTimeframeStartNavigation)
                    .HasForeignKey(d => d.TimeframeStartID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_Date_dim_start");

                entity.HasOne(d => d.VariableSpecific)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.VariableSpecificId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_Variables_dim");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.WaterSourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_WaterSources_dim");

                entity.HasOne(d => d.CustomerTypeCvNavigation)
                       .WithMany(p => p.SiteVariableAmountsFact)
                   .HasForeignKey(d => d.CustomerTypeCv)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("fk_SiteVariableAmounts_CustomerType");

                entity.HasOne(d => d.SDWISIdentifierCvNavigation)
                   .WithMany(p => p.SiteVariableAmountsFact)
                   .HasForeignKey(d => d.SDWISIdentifierCv)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("fk_SiteVariableAmounts_fact_SDWISIdentifier");

                entity.HasOne(d => d.PowerTypeCV)
                    .WithMany(p => p.SiteVariableAmountsFact)
                    .HasForeignKey(d => d.PowerType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SiteVariableAmounts_fact_PowerTypeCV");
            });

            modelBuilder.Entity<SitesBridgeBeneficialUsesFact>(entity =>
            {
                entity.HasKey(e => e.SiteBridgeId)
                    .HasName("pkSitesBridge_BeneficialUses_fact");

                entity.ToTable("SitesBridge_BeneficialUses_fact", "Core");

                entity.Property(e => e.SiteBridgeId).HasColumnName("SiteBridgeID");

                entity.Property(e => e.BeneficialUseCV).HasColumnName("BeneficialUseCV");

                entity.Property(e => e.SiteVariableAmountId).HasColumnName("SiteVariableAmountID");

                entity.HasOne(d => d.BeneficialUse)
                    .WithMany(p => p.SitesBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.BeneficialUseCV)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SitesBridge_BeneficialUses_fact_BeneficialUses");

                entity.HasOne(d => d.SiteVariableAmount)
                    .WithMany(p => p.SitesBridgeBeneficialUsesFact)
                    .HasForeignKey(d => d.SiteVariableAmountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_SitesBridge_BeneficialUses_fact_SiteVariableAmounts_fact");
            });

            modelBuilder.Entity<SitesDim>(entity =>
            {
                entity.HasKey(e => e.SiteId)
                    .HasName("pkSites_dim");

                entity.ToTable("Sites_dim", "Core");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.Property(e => e.CoordinateAccuracy).HasMaxLength(255);

                entity.Property(e => e.CoordinateMethodCv)
                    .IsRequired()
                    .HasColumnName("CoordinateMethodCV")
                    .HasMaxLength(100);

                entity.Property(e => e.EpsgcodeCv)
                    .IsRequired()
                    .HasColumnName("EPSGCodeCV")
                    .HasMaxLength(50);

                entity.Property(e => e.Geometry).HasColumnType("geometry");

                entity.Property(e => e.GniscodeCv)
                    .HasColumnName("GNISCodeCV")
                    .HasMaxLength(250);

                entity.Property(e => e.NhdnetworkStatusCv)
                    .HasColumnName("NHDNetworkStatusCV")
                    .HasMaxLength(50);

                entity.Property(e => e.NhdproductCv)
                    .HasColumnName("NHDProductCV")
                    .HasMaxLength(50);

                entity.Property(e => e.SiteName)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.SiteNativeId)
                    .HasColumnName("SiteNativeID")
                    .HasMaxLength(50);

                entity.Property(e => e.SitePoint).HasColumnType("geometry");

                entity.Property(e => e.SiteTypeCv)
                    .HasColumnName("SiteTypeCV")
                    .HasMaxLength(100);

                entity.Property(e => e.SiteUuid)
                    .IsRequired()
                    .HasColumnName("SiteUUID")
                    .HasMaxLength(200);

                entity.Property(e => e.HUC8)
                    .HasColumnName("HUC8")
                    .HasMaxLength(20);

                entity.Property(e => e.HUC12)
                    .HasColumnName("HUC12")
                    .HasMaxLength(20);

                entity.Property(e => e.County)
                    .HasColumnName("County")
                    .HasMaxLength(20);

                entity.Property(e => e.UsgssiteId)
                    .HasColumnName("USGSSiteID")
                    .HasMaxLength(250);

                entity.Property(e => e.PODorPOUSite)
                    .HasColumnName("PODorPOUSite")
                    .HasMaxLength(50);

                entity.HasOne(d => d.CoordinateMethodCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.CoordinateMethodCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites_dim_CoordinateMethod");

                entity.HasOne(d => d.EpsgcodeCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.EpsgcodeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites_dim_EPSGCode");

                entity.HasOne(d => d.GniscodeCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.GniscodeCv)
                    .HasConstraintName("FK_Sites_dim_GNISFeatureName");

                entity.HasOne(d => d.NhdnetworkStatusCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.NhdnetworkStatusCv)
                    .HasConstraintName("FK_Sites_dim_NHDNetworkStatus");

                entity.HasOne(d => d.NhdproductCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.NhdproductCv)
                    .HasConstraintName("FK_Sites_dim_NHDProduct");

                entity.HasOne(d => d.SiteTypeCvNavigation)
                    .WithMany(p => p.SitesDim)
                    .HasForeignKey(d => d.SiteTypeCv)
                    .HasConstraintName("fk_Sites_dim_SiteType");

                entity.HasOne(d => d.StateCVNavigation)
                    .WithMany(p => p.SitesDims)
                    .HasForeignKey(d => d.StateCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites_dim_StateCV");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkState");

                entity.ToTable("State", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(2)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(10);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(100);

                entity.Property(e => e.StateAbbr)
                    .HasColumnName("State")
                    .HasMaxLength(10);

                entity.Property(e => e.Term).HasMaxLength(2);
            });

            modelBuilder.Entity<Units>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkUnits");

                entity.ToTable("Units", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            //modelBuilder.Entity<Usgscategory>(entity =>
            //{
            //    entity.HasKey(e => e.Name)
            //        .HasName("pkUSGSCategory");

            //    entity.ToTable("USGSCategory", "CVs");

            //    entity.Property(e => e.Name)
            //        .HasMaxLength(250)
            //        .ValueGeneratedNever();

            //    entity.Property(e => e.SourceVocabularyUri)
            //        .HasColumnName("SourceVocabularyURI")
            //        .HasMaxLength(250);

            //    entity.Property(e => e.State).HasMaxLength(250);

            //    entity.Property(e => e.Term)
            //        .IsRequired()
            //        .HasMaxLength(250);
            //});

            modelBuilder.Entity<Variable>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkVariable");

                entity.ToTable("Variable", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<VariableSpecific>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkVariableSpecific");

                entity.ToTable("VariableSpecific", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<VariablesDim>(entity =>
            {
                entity.HasKey(e => e.VariableSpecificId)
                    .HasName("pkVariables_dim");

                entity.ToTable("Variables_dim", "Core");

                entity.Property(e => e.VariableSpecificId).HasColumnName("VariableSpecificID");

                entity.Property(e => e.AggregationInterval)
                    .HasColumnName("AggregationInterval ")
                    .HasColumnType("numeric(10, 1)");

                entity.Property(e => e.AggregationIntervalUnitCv)
                    .IsRequired()
                    .HasColumnName("AggregationIntervalUnitCV ")
                    .HasMaxLength(250);

                entity.Property(e => e.AggregationStatisticCv)
                    .IsRequired()
                    .HasColumnName("AggregationStatisticCV")
                    .HasMaxLength(50);

                entity.Property(e => e.AmountUnitCv)
                    .IsRequired()
                    .HasColumnName("AmountUnitCV")
                    .HasMaxLength(250);

                entity.Property(e => e.MaximumAmountUnitCv)
                    .HasColumnName("MaximumAmountUnitCV")
                    .HasMaxLength(250);

                entity.Property(e => e.ReportYearStartMonth)
                    .IsRequired()
                    .HasColumnName("ReportYearStartMonth ")
                    .HasMaxLength(10);

                entity.Property(e => e.ReportYearTypeCv)
                    .IsRequired()
                    .HasColumnName("ReportYearTypeCV ")
                    .HasMaxLength(250);

                entity.Property(e => e.VariableCv)
                    .IsRequired()
                    .HasColumnName("VariableCV")
                    .HasMaxLength(250);

                entity.Property(e => e.VariableSpecificCv)
                    .IsRequired()
                    .HasColumnName("VariableSpecificCV")
                    .HasMaxLength(250);

                //entity.Property(e => e.VariableSpecificUuid)
                //    .HasColumnName("VariableSpecificUUID")
                //    .HasMaxLength(250);

                entity.HasOne(d => d.AggregationIntervalUnitCvNavigation)
                    .WithMany(p => p.VariablesDimAggregationIntervalUnitCvNavigation)
                    .HasForeignKey(d => d.AggregationIntervalUnitCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Units_interval");

                entity.HasOne(d => d.AggregationStatisticCvNavigation)
                    .WithMany(p => p.VariablesDim)
                    .HasForeignKey(d => d.AggregationStatisticCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_AggregationStatistic");

                entity.HasOne(d => d.AmountUnitCvNavigation)
                    .WithMany(p => p.VariablesDimAmountUnitCvNavigation)
                    .HasForeignKey(d => d.AmountUnitCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Units");

                entity.HasOne(d => d.MaximumAmountUnitCvNavigation)
                    .WithMany(p => p.VariablesDimMaximumAmountUnitCvNavigation)
                    .HasForeignKey(d => d.MaximumAmountUnitCv)
                    .HasConstraintName("fk_Variables_dim_Units_max");

                entity.HasOne(d => d.ReportYearTypeCvNavigation)
                    .WithMany(p => p.VariablesDim)
                    .HasForeignKey(d => d.ReportYearTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_ReportYearType");

                entity.HasOne(d => d.VariableCvNavigation)
                    .WithMany(p => p.VariablesDim)
                    .HasForeignKey(d => d.VariableCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_Variable");

                entity.HasOne(d => d.VariableSpecificCvNavigation)
                    .WithMany(p => p.VariablesDim)
                    .HasForeignKey(d => d.VariableSpecificCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Variables_dim_VariableSpecific");
            });

            modelBuilder.Entity<WaterAllocationBasis>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterAllocationBasis");

                entity.ToTable("WaterAllocationBasis", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(2);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<WaterAllocationType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterAllocationType");

                entity.ToTable("WaterAllocationType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(2);

                entity.Property(e => e.Term).HasMaxLength(250);
            });

            modelBuilder.Entity<WaterQualityIndicator>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterQualityIndicator");

                entity.ToTable("WaterQualityIndicator", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<WaterSourceBridgeSitesFact>(entity =>
            {
                entity.HasKey(e => e.WaterSourceBridgeSiteId);

                entity.ToTable("WaterSourceBridge_Sites_fact", "Core");

                entity.Property(e => e.WaterSourceBridgeSiteId).HasColumnName("WaterSourceBridgeSiteID");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.Property(e => e.SiteId).HasColumnName("SiteID");

                entity.HasOne(d => d.WaterSource)
                    .WithMany(p => p.WaterSourceBridgeSitesFact)
                    .HasForeignKey(d => d.WaterSourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WaterSource");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.WaterSourceBridgeSitesFact)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sites");
            });

            modelBuilder.Entity<WaterSourceType>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("pkWaterSourceType");

                entity.ToTable("WaterSourceType", "CVs");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.Definition).HasMaxLength(4000);

                entity.Property(e => e.SourceVocabularyUri)
                    .HasColumnName("SourceVocabularyURI")
                    .HasMaxLength(250);

                entity.Property(e => e.State).HasMaxLength(250);

                entity.Property(e => e.Term)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<WaterSourcesDim>(entity =>
            {
                entity.HasKey(e => e.WaterSourceId)
                    .HasName("pkWaterSources_dim");

                entity.ToTable("WaterSources_dim", "Core");

                entity.Property(e => e.WaterSourceId).HasColumnName("WaterSourceID");

                entity.Property(e => e.Geometry).HasColumnType("geometry");

                entity.Property(e => e.GnisfeatureNameCv)
                    .HasColumnName("GNISFeatureNameCV")
                    .HasMaxLength(250);

                entity.Property(e => e.WaterQualityIndicatorCv)
                    .IsRequired()
                    .HasColumnName("WaterQualityIndicatorCV")
                    .HasMaxLength(100);

                entity.Property(e => e.WaterSourceName).HasMaxLength(250);

                entity.Property(e => e.WaterSourceNativeId)
                    .HasColumnName("WaterSourceNativeID")
                    .HasMaxLength(250);

                entity.Property(e => e.WaterSourceTypeCv)
                    .IsRequired()
                    .HasColumnName("WaterSourceTypeCV")
                    .HasMaxLength(100);

                entity.Property(e => e.WaterSourceUuid)
                    .IsRequired()
                    .HasColumnName("WaterSourceUUID")
                    .HasMaxLength(100);

                entity.HasOne(d => d.GnisfeatureNameCvNavigation)
                    .WithMany(p => p.WaterSourcesDim)
                    .HasForeignKey(d => d.GnisfeatureNameCv)
                    .HasConstraintName("fk_WaterSources_dim_GNISFeatureName");

                entity.HasOne(d => d.WaterQualityIndicatorCvNavigation)
                    .WithMany(p => p.WaterSourcesDim)
                    .HasForeignKey(d => d.WaterQualityIndicatorCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WaterSources_dim_WaterQualityIndicator");

                entity.HasOne(d => d.WaterSourceTypeCvNavigation)
                    .WithMany(p => p.WaterSourcesDim)
                    .HasForeignKey(d => d.WaterSourceTypeCv)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WaterSources_dim_WaterSourceType");
            });

            modelBuilder.Entity<PODSiteToPOUSiteFact>(entity =>
            {
                entity.HasKey(e => e.PODSiteToPOUSiteId);

                entity.ToTable("PODSite_POUSite_fact", "Core");

                entity.Property(e => e.PODSiteToPOUSiteId).HasColumnName("PODSitePOUSiteFactID");

                entity.Property(e => e.PODSiteId).HasColumnName("PODSiteID");

                entity.Property(e => e.POUSiteId).HasColumnName("POUSiteID");

                entity.HasOne(d => d.PODSite)
                    .WithMany(p => p.PODSiteToPOUSitePODFact)
                    .HasForeignKey(d => d.PODSiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PODSite_POUSite_fact_PODSite_Site");

                entity.HasOne(d => d.POUSite)
                    .WithMany(p => p.PODSiteToPOUSitePOUFact)
                    .HasForeignKey(d => d.POUSiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PODSite_POUSite_fact_POUSite_Site");

            });
        }
    }
}
