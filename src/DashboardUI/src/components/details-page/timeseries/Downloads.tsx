import { ApiData } from "./ApiInterface";
import "./time.scss";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface TimeSeriesPropertiesProps {
  apiData: ApiData[] | null;
}

function Downloads({ apiData }: TimeSeriesPropertiesProps) {
  const organizationName = Object(apiData).Organizations[0].OrganizationName;
  const organizationPurview = Object(apiData).Organizations[0].OrganizationPurview;
  const organizationWebsite = Object(apiData).Organizations[0].OrganizationWebsite;
  const organizationPhoneNumber = Object(apiData).Organizations[0].OrganizationPhoneNumber;
  const organizationContactName = Object(apiData).Organizations[0].OrganizationContactName;
  const organizationContactEmail = Object(apiData).Organizations[0].OrganizationContactEmail;
  const organizationState = Object(apiData).Organizations[0].OrganizationState;
  const organizationData = [
    organizationName,
    organizationPurview,
    organizationWebsite,
    organizationPhoneNumber,
    organizationContactName,
    organizationContactEmail,
    organizationState,
  ];

  const methodUUID = Object(apiData).Organizations[0].Methods[0].MethodUUID;
  const methodName = Object(apiData).Organizations[0].Methods[0].MethodName;
  const methodDescription = Object(apiData).Organizations[0].Methods[0].MethodDescription;
  const methodNEMLink = Object(apiData).Organizations[0].Methods[0].MethodNEMILink;
  const applicableResourceType = Object(apiData).Organizations[0].Methods[0].ApplicableResourceType;
  const methodTypeCV = Object(apiData).Organizations[0].Methods[0].MethodTypeCV;
  const dataCoverageValue = Object(apiData).Organizations[0].Methods[0].DataCoverageValue;
  const dataQualityValue = Object(apiData).Organizations[0].Methods[0].DataQualityValue;
  const dataConfidenceValue =Object(apiData).Organizations[0].Methods[0].DataConfidenceValue;
  const methodData = [
    methodUUID,
    methodName,
    methodDescription,
    methodNEMLink,
    applicableResourceType,
    methodTypeCV,
    dataCoverageValue,
    dataQualityValue,
    dataConfidenceValue,
  ];

  function formatDate(date: Date | string | number | null) {
    if (date instanceof Date) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      } as Intl.DateTimeFormatOptions;
      return date.toLocaleDateString(undefined, options);
    } else if (typeof date === "string") {
      const parsedDate = new Date(date);

      if (!isNaN(parsedDate.getTime())) {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        } as Intl.DateTimeFormatOptions;
        return parsedDate.toLocaleDateString(undefined, options);
      }
    }
    return date;
  }

  const variableSpecificsInfoData = Object(apiData).Organizations[0].VariableSpecifics;
  const siteInformationData = Object(apiData).Organizations[0].Sites;
  const siteSpecificAmountsData = Object(apiData).Organizations[0].SiteVariableAmounts;
  const waterSourcesInfoData = Object(apiData).Organizations[0].WaterSources;
  const relatedPODSites = Object(apiData).Organizations[0].Sites[0].RelatedPODSites;
  const relatedPOUSites = Object(apiData).Organizations[0].Sites[0].RelatedPOUSites;

  const relatedPODUCsv = (site: any) => {
    const PODdata = site.map(
      (item: { SiteUUID: string; StartDate: string; EndDate: string }) => {
        return [
          formatDate(item.SiteUUID),
          formatDate(item.StartDate) || "",
          formatDate(item.EndDate) || "",
        ].join(",");
      }
    );
    const PODUCsvContent = ["SiteUUID,StartDate,EndDate", ...PODdata].join(
      "\n"
    );

    return PODUCsvContent;
  };

  const methodCsv = () => {
    const methodCsvContent = [
      "MethodUUID,MethodName,MethodDescription,MethodNEMILink,ApplicableResourceType,MethodTypeCV,DataCoverageValue,DataQualityValue,DataConfidenceValue",
      methodData.map((item) => `"${item}"`).join(","),
    ].join("\n");
    return methodCsvContent;
  };

  const organizationCsv = () => {
    const organizationCsvContent = [
      "OrganizationName,OrganizationPurview,OrganizationWebsite,OrganizationPhoneNumber,OrganizationContactName,OrganizationContactEmail,OrganizationState",
      organizationData.map((item) => `"${item}"`).join(","),
    ].join("\n");

    return organizationCsvContent;
  };

  const variableCsv = () => {
    const csvData = variableSpecificsInfoData.map(
      (item: {
        VariableSpecificUUID: any;
        VariableSpecificTypeCV: any;
        VariableCV: any;
        AmountUnitCV: any;
        AggregationStatisticCV: any;
        AggregationInterval: any;
        AggregationIntervalUnitCV: any;
        ReportYearStartMonth: any;
        ReportYearTypeCV: any;
        MaximumAmountUnitCV: any;
      }) => {
        return [
          item.VariableSpecificUUID || "",
          item.VariableSpecificTypeCV || "",
          item.VariableCV || "",
          item.AmountUnitCV || "",
          item.AggregationStatisticCV || "",
          item.AggregationInterval || "",
          item.AggregationIntervalUnitCV || "",
          item.ReportYearStartMonth || "",
          item.ReportYearTypeCV || "",
          item.MaximumAmountUnitCV || "",
        ].join(",");
      }
    );
    const tableCsvContent = [
      "VariableSpecificUUID,VariableSpecificTypeCV,VariableCV,AmountUnitCV,AggregationStatisticCV,AggregationInterval,AggregationIntervalUnitCV,ReportYearStartMonth,ReportYearTypeCV,MaximumAmountUnitCV",
      ...csvData,
    ].join("\n");

    return tableCsvContent;
  };

  const siteCsv = () => {
    const csvData = siteInformationData.map(
      (item: {
        SiteUUID: any;
        SiteName: any;
        SiteTypeCV: any;
        NativeSiteID: any;
        Longitude: any;
        Latitude: any;
        CoordinateMethodCV: any;
        AllocationGNISIDCV: any;
        HUC8: any;
        HUC12: any;
        County: any;
        PODorPOUSite: any;
        WaterSourceUUIDs: any;
        SiteGeometry: any;
      }) => {
        const geometry: number[][] = item.SiteGeometry.replace("POLYGON ((", "")
          .replace("))", "")
          .split(",")
          .map((point: string) => point.trim().split(" ").map(parseFloat));

        const coordinates: string = geometry
          .map((pair: number[]) => pair.join(" "))
          .join("; ");

        return [
          item.SiteUUID || "",
          item.SiteName || "",
          item.SiteTypeCV || "",
          item.NativeSiteID || "",
          item.Longitude || "",
          item.Latitude || "",
          item.CoordinateMethodCV || "",
          item.AllocationGNISIDCV || "",
          item.HUC8 || "",
          item.HUC12 || "",
          item.County || "",
          item.PODorPOUSite || "",
          item.WaterSourceUUIDs || "",
          coordinates,
        ].join(",");
      }
    );
    const tableCsvContent = [
      "SiteUUID,SiteName,SiteTypeCV,NativeSiteID,Longitude,Latitude,CoordinateMethodCV,AllocationGNISIDCV,HUC8,HUC12,County,PODorPOUSite,WaterSourceUUIDs,SiteGeometry",
      ...csvData,
    ].join("\n");

    return tableCsvContent;
  };

  const waterCsv = () => {
    const csvData = waterSourcesInfoData.map(
      (item: {
        WaterSourceName: any;
        WaterSourceNativeID: any;
        WaterSourceUUID: any;
        WaterSourceTypeCV: any;
        FreshSalineIndicatorCV: any;
        WaterSourceGeometry: any;
      }) => {
        return [
          item.WaterSourceName || "",
          item.WaterSourceNativeID || "",
          item.WaterSourceUUID || "",
          item.WaterSourceTypeCV || "",
          item.FreshSalineIndicatorCV || "",
          item.WaterSourceGeometry || "",
        ].join(",");
      }
    );
    const tableCsvContent = [
      "WaterSourceName,WaterSourceNativeID,WaterSourceUUID,WaterSourceTypeCV,FreshSalineIndicatorCV,WaterSourceGeometry",
      ...csvData,
    ].join("\n");

    return tableCsvContent;
  };

  const tableCsv = () => {
    const csvData = siteSpecificAmountsData.map(
      (item: {
        WaterSourceUUID: any;
        AllocationGNISIDCV: any;
        TimeframeStart: any;
        TimeframeEnd: any;
        DataPublicationDate: any;
        AllocationCropDutyAmount: any;
        Amount: any;
        IrrigationMethodCV: any;
        IrrigatedAcreage: any;
        CropTypeCV: any;
        PopulationServed: any;
        PowerGeneratedGWh: any;
        AllocationCommunityWaterSupplySystem: any;
        SDWISIdentifier: any;
        DataPublicationDOI: any;
        ReportYearCV: any;
        MethodUUID: any;
        VariableSpecificUUID: any;
        SiteUUID: any;
        AssociatedNativeAllocationIDs: any;
        BeneficialUses: any;
      }) => {
        return [
          item.WaterSourceUUID || "",
          item.AllocationGNISIDCV || "",
          formatDate(item.TimeframeStart) || "",
          formatDate(item.TimeframeEnd) || "",
          formatDate(item.DataPublicationDate) || "",
          item.AllocationCropDutyAmount || "",
          item.Amount || "",
          item.IrrigationMethodCV || "",
          item.IrrigatedAcreage || "",
          item.CropTypeCV || "",
          item.PopulationServed || "",
          item.PowerGeneratedGWh || "",
          item.AllocationCommunityWaterSupplySystem || "",
          item.SDWISIdentifier || "",
          item.DataPublicationDOI || "",
          item.ReportYearCV || "",
          item.MethodUUID || "",
          item.VariableSpecificUUID || "",
          item.SiteUUID || "",
          item.AssociatedNativeAllocationIDs || "",
          item.BeneficialUses || "",
        ].join(",");
      }
    );

    const tableCsvContent = [
      "WaterSourceUUID,AllocationGNISIDCV,TimeframeStart,TimeframeEnd,DataPublicationDate,AllocationCropDutyAmount,Amount,IrrigationMethodCV,IrrigatedAcreage,CropTypeCV,PopulationServed,PowerGeneratedGWh,AllocationCommunityWaterSupplySystem,SDWISIdentifier,DataPublicationDOI,ReportYearCV,MethodUUID,VariableSpecificUUID,SiteUUID,AssociatedNativeAllocationIDs,BeneficialUses",
      ...csvData,
    ].join("\n");

    return tableCsvContent;
  };

  const downloadAllCsv = async () => {
    const zip = new JSZip();

    // Add other CSV files to the zip folder
    zip.file("SiteSpecificAmountsData.csv", tableCsv());
    zip.file("OrganizationData.csv", organizationCsv());
    zip.file("MethodInformationData.csv", methodCsv());
    zip.file("WaterSourceInfoData.csv", waterCsv());
    zip.file("VariableSpecificsInfoData.csv", variableCsv());
    zip.file("SiteInformationData.csv", siteCsv());
    zip.file("RelatedPODSitesData.csv", relatedPODUCsv(relatedPODSites));
    zip.file("RelatedPOUSitesData.csv", relatedPODUCsv(relatedPOUSites));

    // Fetch and add Citation.txt to the zip folder
    const txtFetch = await fetch(
      "https://raw.githubusercontent.com/WSWCWaterDataExchange/WestDAAT/9dbb131594bb9b06ace6871d7e8d4038c94fbcf4/src/API/WesternStatesWater.WestDaat.Utilities/Resources/Citation.txt"
    );
    const fileTxt = await txtFetch.text();
    zip.file("Citation.txt", fileTxt);

    // Generate the zip content
    const zipContent = await zip.generateAsync({ type: "blob" });

    saveAs(zipContent, "DataFiles.zip");
  };

  return (
    <div className="download">
      <button onClick={downloadAllCsv} className="download-button">
        Download Data
      </button>
    </div>
  );
}
export default Downloads;
