export interface ApiData {

  TotalSiteVariableAmountsCount: number
  Organizations: [
    {
      OrganizationName: string | null
      OrganizationPurview: string | null
      OrganizationWebsite: string | null
      OrganizationPhoneNumber: string | null
      OrganizationContactName: string | null
      OrganizationContactEmail: string | null
      OrganizationState: string | null
      WaterSources: [
        {
          WaterSourceName: string | null
          WaterSourceNativeID: string | null
          WaterSourceUUID: string | null
          WaterSourceTypeCV: string | null
          FreshSalineIndicatorCV: string | null
          WaterSourceGeometry: string | null
        }
      ][],
      VariableSpecifics: [
        {
          VariableSpecificUUID: string | null
          VariableSpecificTypeCV: string | null
          VariableCV: string | null
          AmountUnitCV: string | null
          AggregationStatisticCV: string | null
          AggregationInterval: number | null
          AggregationIntervalUnitCV: string | null
          ReportYearStartMonth: string | null
          ReportYearTypeCV: string | null
          MaximumAmountUnitCV: string | null
        }
      ][],
      Methods: [
        {
          MethodUUID: string | null
          MethodName: string | null
          MethodDescription: string | null
          MethodNEMILink: string | null
          ApplicableResourceType: string | null
          MethodTypeCV: string | null
          DataCoverageValue: string | null
          DataQualityValue: string | null
          DataConfidenceValue: string | null
        }
      ][],
      BeneficialUses: [
        {
          Term: string | null
          State: string | null
          Definition: string | null
          Name: string | null
          SourceVocabularyURI: string | null
          USGSCategory: string | null
          NAICSCode: string | null
        }
      ][],
      SiteVariableAmounts: [
        {
          WaterSourceUUID: string | null
          AllocationGNISIDCV: string | null
          TimeframeStart: string | null
          TimeframeEnd: string | null
          DataPublicationDate: string | null
          AllocationCropDutyAmount: string | null
          Amount: number
          IrrigationMethodCV: string | null
          IrrigatedAcreage: string | null
          CropTypeCV: string | null
          PopulationServed: string | null
          PowerGeneratedGWh: string | null
          AllocationCommunityWaterSupplySystem: string | null
          SDWISIdentifier: string | null
          DataPublicationDOI: string | null
          ReportYearCV: string | null
          MethodUUID: string | null
          VariableSpecificUUID: string | null
          SiteUUID: string | null
          AssociatedNativeAllocationIDs: string | null
          BeneficialUses: string[]
        }
      ][],
      Sites: [
        {
          SiteUUID: string | null
          SiteName: string | null
          SiteTypeCV: string | null
          NativeSiteID: string | null
          Longitude: number
          Latitude: number
          SiteGeometry: string | null
          CoordinateMethodCV: string | null
          AllocationGNISIDCV: string | null
          HUC8: string | null
          HUC12: string | null
          County: string | null
          PODorPOUSite: string | null
          RelatedPODSites: string[]
          RelatedPOUSites: string[]
          WaterSourceUUIDs: string[]
        }
      ][]
    }
  ]
}