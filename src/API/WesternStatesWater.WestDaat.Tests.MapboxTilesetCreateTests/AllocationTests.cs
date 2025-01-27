using System.Text.Json;
using FluentAssertions;
using GeoJSON.Text.Feature;
using NetTopologySuite.Geometries;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

[TestClass]
public class AllocationTests : MapboxTilesetTestBase
{
    [DataTestMethod]
    [DataRow(true)]
    [DataRow(false)]
    public async Task Allocation_Points(bool isPoint)
    {
        var tapWaterBeneficialUse = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "TapWater")
            .RuleFor(r => r.WaDEName, "Tap Water")
            .RuleFor(r => r.State, "All")
            .Generate();

        Db.BeneficialUsesCV.AddRange(tapWaterBeneficialUse);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////
        var utahGroundWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "Ground")
            .RuleFor(r => r.WaDEName, "Groundwater")
            .Generate();

        Db.WaterSourceType.AddRange(utahGroundWaterSourceType);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahGroundWaterSource = new WaterSourceDimFaker()
            .RuleFor(r => r.WaterSourceTypeCv, utahGroundWaterSourceType.Name)
            .RuleFor(r => r.WaterSourceTypeCvNavigation, utahGroundWaterSourceType)
            .Generate();

        Db.WaterSourcesDim.AddRange(utahGroundWaterSource);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var armyClassification = new OwnerClassificationCvFaker()
            .RuleFor(r => r.Name, "Army")
            .RuleFor(r => r.WaDEName, "Military")
            .Generate();

        Db.OwnerClassificationCv.AddRange(armyClassification);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var legalStatusPending = new LegalStatusCVFaker()
            .RuleFor(r => r.Name, "Pending")
            .RuleFor(r => r.WaDEName, "Pending")
            .Generate();
        var legalStatusClaimed = new LegalStatusCVFaker()
            .RuleFor(r => r.Name, "Claimed")
            .RuleFor(r => r.WaDEName, "Claimed")
            .Generate();
        Db.LegalStatus.AddRange(legalStatusPending, legalStatusClaimed);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var siteTypeDitch = new SiteTypeFaker()
            .RuleFor(r => r.Name, "Canal")
            .RuleFor(r => r.WaDEName, "Canal / Ditch / Diversion")
            .Generate();
        var siteTypeCanal = new SiteTypeFaker()
            .RuleFor(r => r.Name, "Ditch")
            .RuleFor(r => r.WaDEName, "Canal / Ditch / Diversion")
            .Generate();
        Db.SiteType.AddRange(siteTypeDitch, siteTypeCanal);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var allocationTypeAllClaim = new WaterAllocationTypeCVFaker()
            .RuleFor(r => r.Name, "All_Claim")
            .RuleFor(r => r.WaDEName, "Claim")
            .Generate();
        var allocationTypeClaimAmmendment = new WaterAllocationTypeCVFaker()
            .RuleFor(r => r.Name, "All_ClaimAmendment")
            .RuleFor(r => r.WaDEName, "Claim")
            .Generate();
        Db.WaterAllocationType.AddRange(allocationTypeAllClaim, allocationTypeClaimAmmendment);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var utahDivisionOrganization = new OrganizationsDimFaker()
            .RuleFor(r => r.OrganizationName, "Utah Division of Water Rights")
            .RuleFor(r => r.State, "UT")
            .Generate();
        Db.OrganizationsDim.AddRange(utahDivisionOrganization);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var januraryDates = new DateDimFaker().Generate(1);
        Db.DateDim.AddRange(januraryDates);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSitePouAllocation = new SitesDimFaker()
            .RuleFor(r => r.SiteUuid, "utah_site_one_allocation")
            .RuleFor(r => r.PODorPOUSite, "POU")
            .RuleFor(r => r.SiteTypeCv, siteTypeDitch.Name)
            .RuleFor(r => r.SiteTypeCvNavigation, siteTypeDitch)
            .RuleFor(r => r.Geometry, isPoint ? Point.Empty : Polygon.Empty)
            .Generate();
        Db.SitesDim.AddRange(utahSitePouAllocation);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahWaterSourceBridge = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahGroundWaterSource.WaterSourceId,
                utahSitePouAllocation.SiteId)
            .Generate();
        Db.WaterSourceBridgeSitesFact.AddRange(utahWaterSourceBridge);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var allocationAmount = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, f => "Tom TapWater")
            .RuleFor(r => r.OwnerClassificationCV, armyClassification.Name)
            .RuleFor(r => r.OrganizationId, utahDivisionOrganization.OrganizationId)
            .RuleFor(r => r.Organization, utahDivisionOrganization)
            .RuleFor(r => r.AllocationLegalStatusCv, legalStatusPending.Name)
            .RuleFor(r => r.AllocationLegalStatusCvNavigation, legalStatusPending)
            .RuleFor(r => r.AllocationTypeCv, allocationTypeAllClaim.Name)
            .RuleFor(r => r.AllocationTypeCvNavigation, allocationTypeAllClaim)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, true)
            .RuleFor(r => r.AllocationFlow_CFS, 1)
            .RuleFor(r => r.AllocationVolume_AF, 10)
            .RuleFor(r => r.AllocationPriorityDateID, januraryDates[0].DateId)
            .LinkBeneficialUses(tapWaterBeneficialUse)
            .Generate();

        Db.AllocationAmountsFact.AddRange(allocationAmount);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSiteWithOneAllocationNoBenficialUses = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId,
                utahSitePouAllocation.SiteId)
            .Generate();
        Db.AllocationBridgeSitesFact.AddRange(utahSiteWithOneAllocationNoBenficialUses);
        await Db.SaveChangesAsync();

        // Act
        await MapboxTileset.CreateAllocations(Db, GeoJsonDir);

        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson",
            $"Allocations.{(isPoint ? "Points" : "Polygons")}.geojson"));
        var features = JsonSerializer.Deserialize<List<Maptiler<AllocationFeatureProperties>>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(1);

        // Verify properties...
        var siteWithOneAllocation = features.First(f => f.properties.uuid == "utah_site_one_allocation");
        siteWithOneAllocation.properties.o.Should().Be("Tom TapWater");
        siteWithOneAllocation.properties.oClass.Should().BeEquivalentTo("Military");
        siteWithOneAllocation.properties.bu.Should().BeEquivalentTo("Tap Water");
        siteWithOneAllocation.properties.podPou.Should().Be("POU");
        siteWithOneAllocation.properties.wsType.Should().BeEquivalentTo("Groundwater");
        siteWithOneAllocation.properties.st.Should().BeEquivalentTo("UT");
        siteWithOneAllocation.properties.ls.Should().BeEquivalentTo("Pending");
        siteWithOneAllocation.properties.allocType.Should().BeEquivalentTo("Claim");
        siteWithOneAllocation.properties.sType.Should().BeEquivalentTo("Canal / Ditch / Diversion");
        siteWithOneAllocation.properties.xmpt.Should().Be(true);
        siteWithOneAllocation.properties.minFlow.Should().Be(1);
        siteWithOneAllocation.properties.maxFlow.Should().Be(1);
        siteWithOneAllocation.properties.minVol.Should().Be(10);
        siteWithOneAllocation.properties.maxVol.Should().Be(10);
        siteWithOneAllocation.properties.minPri.Should()
            .Be(new DateTimeOffset(januraryDates[0].Date).ToUnixTimeSeconds());
        siteWithOneAllocation.properties.maxPri.Should()
            .Be(new DateTimeOffset(januraryDates[0].Date).ToUnixTimeSeconds());

        Assert.AreEqual(0, Directory.GetDirectories("geojson").Length, "Temp Points folder should have been deleted.");
    }

    [TestMethod]
    public async Task SiteWithManyAllocations_Aggregates()
    {
        var tapWaterBeneficialUse = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "TapWater")
            .RuleFor(r => r.WaDEName, "Tap Water")
            .RuleFor(r => r.State, "All")
            .Generate();

        var utahBeneficialUseStockwater = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "StockWater")
            .RuleFor(r => r.WaDEName, "Livestock")
            .RuleFor(r => r.State, "UT")
            .Generate();

        var utahBeneficialUseDairy = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "Dairy")
            .RuleFor(r => r.WaDEName, "Livestock")
            .RuleFor(r => r.State, "All")
            .Generate();

        Db.BeneficialUsesCV.AddRange(tapWaterBeneficialUse, utahBeneficialUseStockwater, utahBeneficialUseDairy);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////
        var utahGroundWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "Ground")
            .RuleFor(r => r.WaDEName, "Groundwater")
            .Generate();

        var utahGroundwaterWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "GroundWater")
            .RuleFor(r => r.WaDEName, "Groundwater")
            .Generate();

        var utahCanalSurfaceWaterWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "Canal/Ditch")
            .RuleFor(r => r.WaDEName, "Surface Water")
            .Generate();
        Db.WaterSourceType.AddRange(utahGroundWaterSourceType, utahGroundwaterWaterSourceType,
            utahCanalSurfaceWaterWaterSourceType);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahGroundWaterSource = new WaterSourceDimFaker()
            .RuleFor(r => r.WaterSourceTypeCv, utahGroundWaterSourceType.Name)
            .RuleFor(r => r.WaterSourceTypeCvNavigation, utahGroundWaterSourceType)
            .Generate();

        var utahSurfaceWaterSource = new WaterSourceDimFaker()
            .RuleFor(r => r.WaterSourceTypeCv, utahCanalSurfaceWaterWaterSourceType.Name)
            .RuleFor(r => r.WaterSourceTypeCvNavigation, utahCanalSurfaceWaterWaterSourceType)
            .Generate();

        Db.WaterSourcesDim.AddRange(utahGroundWaterSource, utahSurfaceWaterSource);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var doDClassification = new OwnerClassificationCvFaker()
            .RuleFor(r => r.Name, "DoD")
            .RuleFor(r => r.WaDEName, "Military")
            .Generate();

        var privateClassification = new OwnerClassificationCvFaker()
            .RuleFor(r => r.Name, "Private")
            .RuleFor(r => r.WaDEName, "Private")
            .Generate();

        Db.OwnerClassificationCv.AddRange(doDClassification, privateClassification);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahDivisionOrganization = new OrganizationsDimFaker()
            .RuleFor(r => r.OrganizationName, "Utah Division of Water Rights")
            .RuleFor(r => r.State, "UT")
            .Generate();

        var coloradoDrsOrganization = new OrganizationsDimFaker()
            .RuleFor(r => r.OrganizationName, "Colorado Department of Natural Resources")
            .RuleFor(r => r.State, "CO")
            .Generate();
        Db.OrganizationsDim.AddRange(utahDivisionOrganization, coloradoDrsOrganization);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var januraryDates = new DateDimFaker().Generate(31);
        Db.DateDim.AddRange(januraryDates);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSitePodWithManyAllocations = new SitesDimFaker()
            .RuleFor(r => r.SiteUuid, "utah_site_many_allocations")
            .RuleFor(r => r.PODorPOUSite, "POD")
            .RuleFor(r => r.Geometry, Point.Empty)
            .Generate();
        Db.SitesDim.AddRange(utahSitePodWithManyAllocations);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahWaterSourceBridge = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahGroundWaterSource.WaterSourceId,
                utahSitePodWithManyAllocations.SiteId)
            .Generate();
        var utahSurfaceWaterBridge = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahSurfaceWaterSource.WaterSourceId,
                utahSitePodWithManyAllocations.SiteId);
        Db.WaterSourceBridgeSitesFact.AddRange(utahWaterSourceBridge, utahSurfaceWaterBridge);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahAllocationWithManyBeneficialUses = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, f => "Alice McAlister")
            .RuleFor(r => r.OwnerClassificationCV, privateClassification.Name)
            .RuleFor(r => r.OrganizationId, coloradoDrsOrganization.OrganizationId)
            .RuleFor(r => r.Organization, coloradoDrsOrganization)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, false)
            .RuleFor(r => r.AllocationFlow_CFS, 2)
            .RuleFor(r => r.AllocationVolume_AF, 20)
            .RuleFor(r => r.AllocationPriorityDateID, januraryDates[0].DateId)
            .LinkBeneficialUses(utahBeneficialUseStockwater, utahBeneficialUseDairy, tapWaterBeneficialUse)
            .Generate();

        var utahAllocationWithTapWaterBeneficialUse = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, "Tom TapWater")
            .RuleFor(r => r.OwnerClassificationCV, doDClassification.Name)
            .RuleFor(r => r.OrganizationId, utahDivisionOrganization.OrganizationId)
            .RuleFor(r => r.Organization, utahDivisionOrganization)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, true)
            .RuleFor(r => r.AllocationFlow_CFS, 3)
            .RuleFor(r => r.AllocationVolume_AF, 30)
            .RuleFor(r => r.AllocationPriorityDateID, januraryDates[1].DateId)
            .LinkBeneficialUses(tapWaterBeneficialUse)
            .Generate();

        Db.AllocationAmountsFact.AddRange(
            utahAllocationWithManyBeneficialUses,
            utahAllocationWithTapWaterBeneficialUse);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSiteAllocationBridge1 = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(utahAllocationWithTapWaterBeneficialUse.AllocationAmountId,
                utahSitePodWithManyAllocations.SiteId)
            .Generate();
        var utahSiteAllocationBridge2 = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(utahAllocationWithManyBeneficialUses.AllocationAmountId,
                utahSitePodWithManyAllocations.SiteId);

        Db.AllocationBridgeSitesFact.AddRange(utahSiteAllocationBridge1, utahSiteAllocationBridge2);
        await Db.SaveChangesAsync();

        // Act
        await MapboxTileset.CreateAllocations(Db, GeoJsonDir);

        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson", "Allocations.Points.geojson"));
        var features = JsonSerializer.Deserialize<List<Maptiler<AllocationFeatureProperties>>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(1);

        var siteWithManyAllocations = features.First(f => f.properties.uuid == "utah_site_many_allocations");
        siteWithManyAllocations.properties.o.Should().Contain("Tom TapWater");
        siteWithManyAllocations.properties.o.Should().Contain("Alice McAlister");
        siteWithManyAllocations.properties.oClass.Should().BeEquivalentTo("Military", "Private"); // add other oclass
        siteWithManyAllocations.properties.bu.Should().BeEquivalentTo("Livestock", "Tap Water");
        siteWithManyAllocations.properties.podPou.Should().Be("POD");
        siteWithManyAllocations.properties.wsType.Should().BeEquivalentTo("Groundwater", "Surface Water");
        siteWithManyAllocations.properties.st.Should().BeEquivalentTo("CO", "UT");
        siteWithManyAllocations.properties.xmpt.Should().Be(true, "One allocation was exempt");
        siteWithManyAllocations.properties.minFlow.Should().Be(2);
        siteWithManyAllocations.properties.maxFlow.Should().Be(3);
        siteWithManyAllocations.properties.minVol.Should().Be(20);
        siteWithManyAllocations.properties.maxVol.Should().Be(30);
        siteWithManyAllocations.properties.minPri.Should()
            .Be(new DateTimeOffset(januraryDates[0].Date).ToUnixTimeSeconds());
        siteWithManyAllocations.properties.maxPri.Should()
            .Be(new DateTimeOffset(januraryDates[1].Date).ToUnixTimeSeconds());

        Assert.AreEqual(0, Directory.GetDirectories("geojson").Length, "Temp Points folder should have been deleted.");
    }

    [TestMethod]
    public async Task SiteWithNoFlowVolumeOrPriority_AreNotIncludedInJson()
    {
        var tapWaterBeneficialUse = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "TapWater")
            .RuleFor(r => r.WaDEName, "Tap Water")
            .RuleFor(r => r.State, "All")
            .Generate();

        Db.BeneficialUsesCV.AddRange(tapWaterBeneficialUse);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////
        var utahGroundWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "Ground")
            .RuleFor(r => r.WaDEName, "Groundwater")
            .Generate();

        Db.WaterSourceType.AddRange(utahGroundWaterSourceType);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahGroundWaterSource = new WaterSourceDimFaker()
            .RuleFor(r => r.WaterSourceTypeCv, utahGroundWaterSourceType.Name)
            .RuleFor(r => r.WaterSourceTypeCvNavigation, utahGroundWaterSourceType)
            .Generate();

        Db.WaterSourcesDim.AddRange(utahGroundWaterSource);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var armyClassification = new OwnerClassificationCvFaker()
            .RuleFor(r => r.Name, "Army")
            .RuleFor(r => r.WaDEName, "Military")
            .Generate();

        Db.OwnerClassificationCv.AddRange(armyClassification);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahDivisionOrganization = new OrganizationsDimFaker()
            .RuleFor(r => r.OrganizationName, "Utah Division of Water Rights")
            .RuleFor(r => r.State, "UT")
            .Generate();
        Db.OrganizationsDim.AddRange(utahDivisionOrganization);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSitePouWithOneAllocation = new SitesDimFaker()
            .RuleFor(r => r.SiteUuid, "utah_site_one_allocation")
            .RuleFor(r => r.PODorPOUSite, "POU")
            .RuleFor(r => r.Geometry, Point.Empty)
            .Generate();
        Db.SitesDim.AddRange(utahSitePouWithOneAllocation);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahWaterSourceBridge = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahGroundWaterSource.WaterSourceId,
                utahSitePouWithOneAllocation.SiteId)
            .Generate();
        Db.WaterSourceBridgeSitesFact.AddRange(utahWaterSourceBridge);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var allocationAmount = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, f => f.Name.FullName())
            .RuleFor(r => r.OwnerClassificationCV, armyClassification.Name)
            .RuleFor(r => r.OrganizationId, utahDivisionOrganization.OrganizationId)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, true)
            .RuleFor(r => r.AllocationFlow_CFS, (double?) null)
            .RuleFor(r => r.AllocationVolume_AF, (double?) null)
            .RuleFor(r => r.AllocationPriorityDateID, (int?) null)
            .LinkBeneficialUses(tapWaterBeneficialUse)
            .Generate();

        Db.AllocationAmountsFact.AddRange(allocationAmount);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSiteWithOneAllocationNoBenficialUses = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId,
                utahSitePouWithOneAllocation.SiteId)
            .Generate();
        Db.AllocationBridgeSitesFact.AddRange(utahSiteWithOneAllocationNoBenficialUses);
        await Db.SaveChangesAsync();

        // Act
        await MapboxTileset.CreateAllocations(Db, GeoJsonDir);

        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson", "Allocations.Points.geojson"));
        var features = JsonSerializer.Deserialize<List<Feature>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(1);
        features[0].Properties.ContainsKey("minFlow").Should().BeFalse();
        features[0].Properties.ContainsKey("maxFlow").Should().BeFalse();
        features[0].Properties.ContainsKey("minVol").Should().BeFalse();
        features[0].Properties.ContainsKey("maxVol").Should().BeFalse();
        features[0].Properties.ContainsKey("minPri").Should().BeFalse();
        features[0].Properties.ContainsKey("maxPri").Should().BeFalse();
    }

    [TestMethod]
    public async Task SiteWithTimeSeries_HasPropertiesIncluded()
    {
        var tapWaterBeneficialUse = new BeneficialUsesCVFaker()
            .RuleFor(r => r.Name, "TapWater")
            .RuleFor(r => r.WaDEName, "Tap Water")
            .RuleFor(r => r.State, "All")
            .Generate();

        Db.BeneficialUsesCV.AddRange(tapWaterBeneficialUse);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////
        var utahGroundWaterSourceType = new WaterSourceTypeFaker()
            .RuleFor(r => r.Name, "Ground")
            .RuleFor(r => r.WaDEName, "Groundwater")
            .Generate();

        Db.WaterSourceType.AddRange(utahGroundWaterSourceType);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahGroundWaterSource = new WaterSourceDimFaker()
            .RuleFor(r => r.WaterSourceTypeCv, utahGroundWaterSourceType.Name)
            .RuleFor(r => r.WaterSourceTypeCvNavigation, utahGroundWaterSourceType)
            .Generate();

        Db.WaterSourcesDim.AddRange(utahGroundWaterSource);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var armyClassification = new OwnerClassificationCvFaker()
            .RuleFor(r => r.Name, "Army")
            .RuleFor(r => r.WaDEName, "Military")
            .Generate();

        Db.OwnerClassificationCv.AddRange(armyClassification);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var legalStatusPending = new LegalStatusCVFaker()
            .RuleFor(r => r.Name, "Pending")
            .RuleFor(r => r.WaDEName, "Pending")
            .Generate();
        var legalStatusClaimed = new LegalStatusCVFaker()
            .RuleFor(r => r.Name, "Claimed")
            .RuleFor(r => r.WaDEName, "Claimed")
            .Generate();
        Db.LegalStatus.AddRange(legalStatusPending, legalStatusClaimed);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var siteTypeDitch = new SiteTypeFaker()
            .RuleFor(r => r.Name, "Canal")
            .RuleFor(r => r.WaDEName, "Canal / Ditch / Diversion")
            .Generate();
        var siteTypeCanal = new SiteTypeFaker()
            .RuleFor(r => r.Name, "Ditch")
            .RuleFor(r => r.WaDEName, "Canal / Ditch / Diversion")
            .Generate();
        Db.SiteType.AddRange(siteTypeDitch, siteTypeCanal);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var allocationTypeAllClaim = new WaterAllocationTypeCVFaker()
            .RuleFor(r => r.Name, "All_Claim")
            .RuleFor(r => r.WaDEName, "Claim")
            .Generate();
        var allocationTypeClaimAmmendment = new WaterAllocationTypeCVFaker()
            .RuleFor(r => r.Name, "All_ClaimAmendment")
            .RuleFor(r => r.WaDEName, "Claim")
            .Generate();
        Db.WaterAllocationType.AddRange(allocationTypeAllClaim, allocationTypeClaimAmmendment);
        await Db.SaveChangesAsync();
        ///////////////////////////////////////////////////

        var utahDivisionOrganization = new OrganizationsDimFaker()
            .RuleFor(r => r.OrganizationName, "Utah Division of Water Rights")
            .RuleFor(r => r.State, "UT")
            .Generate();
        Db.OrganizationsDim.AddRange(utahDivisionOrganization);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var januraryDates = new DateDimFaker().Generate(31);
        Db.DateDim.AddRange(januraryDates);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSiteHasTimeSeries = new SitesDimFaker()
            .RuleFor(r => r.SiteUuid, "utah_site_has_time_series")
            .RuleFor(r => r.PODorPOUSite, "POU")
            .RuleFor(r => r.SiteTypeCv, siteTypeDitch.Name)
            .RuleFor(r => r.SiteTypeCvNavigation, siteTypeDitch)
            .RuleFor(r => r.Geometry, Polygon.Empty)
            .Generate();

        var utahSiteNoTimeSeries = new SitesDimFaker()
            .RuleFor(r => r.SiteUuid, "utah_site_no_time_series")
            .RuleFor(r => r.SiteTypeCv, siteTypeCanal.Name)
            .RuleFor(r => r.SiteTypeCvNavigation, siteTypeCanal)
            .RuleFor(r => r.Geometry, Polygon.Empty)
            .Generate();
        Db.SitesDim.AddRange(utahSiteHasTimeSeries, utahSiteNoTimeSeries);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahWaterSourceBridge = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahGroundWaterSource.WaterSourceId,
                utahSiteHasTimeSeries.SiteId)
            .Generate();
        var utahWaterSourceBridge2 = new WaterSourceBridgeSiteFactFaker()
            .WaterSourceBridgeSiteFactFakerWithIds(utahGroundWaterSource.WaterSourceId,
                utahSiteNoTimeSeries.SiteId);
        Db.WaterSourceBridgeSitesFact.AddRange(utahWaterSourceBridge, utahWaterSourceBridge2);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var allocationAmount = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, f => "Tom TapWater")
            .RuleFor(r => r.OwnerClassificationCV, armyClassification.Name)
            .RuleFor(r => r.OrganizationId, utahDivisionOrganization.OrganizationId)
            .RuleFor(r => r.Organization, utahDivisionOrganization)
            .RuleFor(r => r.AllocationLegalStatusCv, legalStatusPending.Name)
            .RuleFor(r => r.AllocationLegalStatusCvNavigation, legalStatusPending)
            .RuleFor(r => r.AllocationTypeCv, allocationTypeAllClaim.Name)
            .RuleFor(r => r.AllocationTypeCvNavigation, allocationTypeAllClaim)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, true)
            .RuleFor(r => r.AllocationFlow_CFS, 1)
            .RuleFor(r => r.AllocationVolume_AF, 10)
            .RuleFor(r => r.AllocationPriorityDateID, januraryDates[0].DateId)
            .LinkBeneficialUses(tapWaterBeneficialUse)
            .Generate();
        
        var allocationAmount2 = new AllocationAmountFactFaker()
            .RuleFor(r => r.AllocationOwner, f => "Tom TapWater")
            .RuleFor(r => r.OwnerClassificationCV, armyClassification.Name)
            .RuleFor(r => r.OrganizationId, utahDivisionOrganization.OrganizationId)
            .RuleFor(r => r.Organization, utahDivisionOrganization)
            .RuleFor(r => r.AllocationLegalStatusCv, legalStatusPending.Name)
            .RuleFor(r => r.AllocationLegalStatusCvNavigation, legalStatusPending)
            .RuleFor(r => r.AllocationTypeCv, allocationTypeAllClaim.Name)
            .RuleFor(r => r.AllocationTypeCvNavigation, allocationTypeAllClaim)
            .RuleFor(r => r.ExemptOfVolumeFlowPriority, true)
            .RuleFor(r => r.AllocationFlow_CFS, 1)
            .RuleFor(r => r.AllocationVolume_AF, 10)
            .RuleFor(r => r.AllocationPriorityDateID, januraryDates[0].DateId)
            .LinkBeneficialUses(tapWaterBeneficialUse)
            .Generate();
        
        Db.AllocationAmountsFact.AddRange(allocationAmount, allocationAmount2);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        var utahSiteWithTimeSeries = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId,
                utahSiteHasTimeSeries.SiteId)
            .Generate();
        
        var utahSiteWithNoTimeSeries = new AllocationBridgeSiteFactFaker()
            .AllocationBridgeSiteFactFakerWithIds(allocationAmount2.AllocationAmountId,
                utahSiteNoTimeSeries.SiteId)
            .Generate();
        Db.AllocationBridgeSitesFact.AddRange(utahSiteWithTimeSeries, utahSiteWithNoTimeSeries);
        await Db.SaveChangesAsync();

        ////////////////////////////////////////////////
        var timeSeries = new SiteVariableAmountsFactFaker()
            .RuleFor(r => r.SiteId, utahSiteHasTimeSeries.SiteId)
            .RuleFor(r => r.Site, utahSiteHasTimeSeries)
            .RuleFor(r => r.TimeframeStartID, januraryDates[0].DateId)
            .RuleFor(r => r.TimeframeEndID, januraryDates[6].DateId)
            .RuleFor(r => r.DataPublicationDateID, januraryDates[6].DateId)
            .Generate();
        var timeSeries2 = new SiteVariableAmountsFactFaker()
            .RuleFor(r => r.SiteId, utahSiteHasTimeSeries.SiteId)
            .RuleFor(r => r.Site, utahSiteHasTimeSeries)
            .RuleFor(r => r.TimeframeStartID, januraryDates[5].DateId)
            .RuleFor(r => r.TimeframeEndID, januraryDates[11].DateId)
            .RuleFor(r => r.DataPublicationDateID, januraryDates[6].DateId)
            .Generate();

        Db.SiteVariableAmountsFact.AddRange(timeSeries, timeSeries2);
        await Db.SaveChangesAsync();
        ////////////////////////////////////////////////

        // Act
        await MapboxTileset.CreateAllocations(Db, GeoJsonDir);

        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson", "Allocations.Polygons.geojson"));
        var features = JsonSerializer.Deserialize<List<Maptiler<AllocationFeatureProperties>>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(2);

    }
}