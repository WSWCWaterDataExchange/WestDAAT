﻿using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Tests.Helpers.Geometry;
using WesternStatesWater.WestDaat.Utilities;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;
using EF = WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class WaterAllocationAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [DataRow(4)]
        [DataRow(1)]
        public async Task GetAnalyticsSummary_ResultCount(int uniquePrimaryUseCount)
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            for (var i = 0; i < uniquePrimaryUseCount; i++)
            {
                var newValues = new AllocationAmountFactFaker()
                    .RuleFor(a => a.PrimaryBeneficialUseCategory, () => $"Primary Use {i}")
                    .Generate(5);
                allocationAmountFacts.AddRange(newValues);
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria { }, Common.AnalyticsInformationGrouping.BeneficialUse);

            //Assert
            results.Length.Should().Be(uniquePrimaryUseCount);
        }

        [TestMethod]
        [DataRow(new double[] { 5, 1, 9 }, new double[] { 10, 2, 0 }, 15, 12, 3)]
        [DataRow(new double[] { -1, 1, 9 }, new double[] { 10, 2, -1 }, 10, 12, 3)]
        [DataRow(new double[] { 3.5553, 2.5533, 23.1 }, new double[] { 1, 1, 1 }, 29.2086, 3, 3)]
        public async Task GetAnalyticsSummary_CorrectSums(double[] flow, double[] volume, double flowSum, double volumeSum, int dataCount)
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var expected = new AnalyticsSummaryInformation()
            {
                Flow = flowSum,
                Volume = volumeSum,
                Points = dataCount,
                PrimaryUseCategoryName = "test",
            };

            for (var i = 0; i < dataCount; i++)
            {
                allocationAmountFacts.AddRange(
                    new AllocationAmountFactFaker()
                    .RuleFor(a => a.PrimaryBeneficialUseCategory, () => "test")
                    .RuleFor(a => a.AllocationFlow_CFS, () => flow[i] > 0 ? flow[i] : null)
                    .RuleFor(a => a.AllocationVolume_AF, () => volume[i] > 0 ? volume[i] : null)
                    .Generate(1));
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria { }, Common.AnalyticsInformationGrouping.BeneficialUse);

            //Assert
            results.First().Should().BeEquivalentTo(expected);
        }

        [DataTestMethod]
        [DataRow(Common.AnalyticsInformationGrouping.BeneficialUse)]
        [DataRow(Common.AnalyticsInformationGrouping.WaterSourceType)]
        [DataRow(Common.AnalyticsInformationGrouping.OwnerType)]
        [DataRow(Common.AnalyticsInformationGrouping.AllocationType)]
        [DataRow(Common.AnalyticsInformationGrouping.LegalStatus)]
        [DataRow(Common.AnalyticsInformationGrouping.SiteType)]
        public async Task GetAnalyticsSummaryInformation_ShouldSucceedForEachGroupValue(Common.AnalyticsInformationGrouping groupValue)
        {
            //Arrange
            var allocationAmountFacts = new AllocationAmountFactFaker().Generate(3);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), groupValue);

            // Assert
            result.Should().NotBeNull();
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForBeneficialUse()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var primaryUse1Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.PrimaryBeneficialUseCategory, () => $"Primary Use 1")
                .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                .RuleFor(a => a.AllocationVolume_AF, () => 2)
                .Generate(5);
            allocationAmountFacts.AddRange(primaryUse1Values);

            var primaryUse2Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.PrimaryBeneficialUseCategory, () => $"Primary Use 2")
                .RuleFor(a => a.AllocationFlow_CFS, () => 3)
                .RuleFor(a => a.AllocationVolume_AF, () => 4)
                .Generate(2);

            allocationAmountFacts.AddRange(primaryUse2Values);

            var expected = new AnalyticsSummaryInformation[]
            {
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Primary Use 1",
                    Flow = 5,
                    Points = 5,
                    Volume = 10,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Primary Use 2",
                    Flow = 6,
                    Volume = 8,
                    Points = 2,
                }
            };

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.BeneficialUse);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForWaterSourceType()
        {
            //Arrange
            var wadeNames = new string[] { "wadename1", "wadename2", "wadename3" };

            var allocationAmountsFacts = wadeNames.Select((name, idx) =>
            {
                return new AllocationAmountFactFaker()
                    .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                    .RuleFor(a => a.AllocationVolume_AF, () => 2)
                    .RuleFor(a => a.AllocationBridgeSitesFact, () => new AllocationBridgeSiteFactFaker()
                        .RuleFor(absf => absf.Site, () => new SitesDimFaker()
                            .RuleFor(site => site.WaterSourceBridgeSitesFact, () => new WaterSourceBridgeSiteFactFaker()
                                .RuleFor(wsbsf => wsbsf.WaterSource, () => new WaterSourceDimFaker()
                                    .RuleFor(ws => ws.WaterSourceTypeCvNavigation, () => new WaterSourceTypeFaker()
                                        .RuleFor(wst => wst.WaDEName, () => name)
                                        .Generate())
                                    .Generate())
                                .Generate(1))
                            .Generate())
                        .Generate(1)
                    )
                    .Generate(idx + 1);
            })
            .SelectMany(array => array)
            .ToArray();

            var expected = new AnalyticsSummaryInformation[]
            {
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "wadename1",
                    Flow = 1,
                    Points = 1,
                    Volume = 2,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "wadename2",
                    Flow = 2,
                    Points = 2,
                    Volume = 4,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "wadename3",
                    Flow = 3,
                    Points = 3,
                    Volume = 6,
                },
            };

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountsFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.WaterSourceType);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForOwnerType()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var ownerClassificationCvs = new EF.OwnerClassificationCv[]
            {
                new OwnerClassificationCvFaker()
                    .RuleFor(occ => occ.Name, () => "Owner Type 1")
                    .Generate(),
                new OwnerClassificationCvFaker()
                    .RuleFor(occ => occ.Name, () => "Owner Type 2")
                    .Generate()
            };

            var primaryUse1Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.OwnerClassification, () => ownerClassificationCvs[0])
                .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                .RuleFor(a => a.AllocationVolume_AF, () => 2)
                .Generate(5);
            allocationAmountFacts.AddRange(primaryUse1Values);

            var primaryUse2Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.OwnerClassification, () => ownerClassificationCvs[1])
                .RuleFor(a => a.AllocationFlow_CFS, () => 3)
                .RuleFor(a => a.AllocationVolume_AF, () => 4)
                .Generate(2);

            allocationAmountFacts.AddRange(primaryUse2Values);

            var expected = new AnalyticsSummaryInformation[]
            {
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Owner Type 1",
                    Flow = 5,
                    Points = 5,
                    Volume = 10,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Owner Type 2",
                    Flow = 6,
                    Volume = 8,
                    Points = 2,
                }
            };

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.OwnerType);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForAllocationType()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var allocationTypes = new EF.WaterAllocationType[]
            {
                new WaterAllocationTypeCVFaker()
                    .RuleFor(wat => wat.Name, () => "Allocation Type 1")
                    .Generate(),
                new WaterAllocationTypeCVFaker()
                    .RuleFor(wat => wat.Name, () => "Allocation Type 2")
                    .Generate()
            };

            var primaryUse1Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationTypeCvNavigation, () => allocationTypes[0])
                .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                .RuleFor(a => a.AllocationVolume_AF, () => 2)
                .Generate(5);
            allocationAmountFacts.AddRange(primaryUse1Values);

            var primaryUse2Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationTypeCvNavigation, () => allocationTypes[1])
                .RuleFor(a => a.AllocationFlow_CFS, () => 3)
                .RuleFor(a => a.AllocationVolume_AF, () => 4)
                .Generate(2);

            allocationAmountFacts.AddRange(primaryUse2Values);

            var expected = new AnalyticsSummaryInformation[]
            {
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Allocation Type 1",
                    Flow = 5,
                    Points = 5,
                    Volume = 10,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Allocation Type 2",
                    Flow = 6,
                    Volume = 8,
                    Points = 2,
                }
            };

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.AllocationType);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForLegalStatus()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var legalStatuses = new EF.LegalStatus[]
            {
                new LegalStatusCVFaker()
                    .RuleFor(x => x.Name, "Legal Status 1")
                    .Generate(),
                new LegalStatusCVFaker()
                    .RuleFor(x => x.Name, "Legal Status 2")
                    .Generate(),
            };

            var primaryUse1Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationLegalStatusCvNavigation, () => legalStatuses[0])
                .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                .RuleFor(a => a.AllocationVolume_AF, () => 2)
                .Generate(5);
            allocationAmountFacts.AddRange(primaryUse1Values);

            var primaryUse2Values = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationLegalStatusCvNavigation, () => legalStatuses[1])
                .RuleFor(a => a.AllocationFlow_CFS, () => 3)
                .RuleFor(a => a.AllocationVolume_AF, () => 4)
                .Generate(2);

            allocationAmountFacts.AddRange(primaryUse2Values);

            var expected = new AnalyticsSummaryInformation[]
            {
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Legal Status 1",
                    Flow = 5,
                    Points = 5,
                    Volume = 10,
                },
                new AnalyticsSummaryInformation
                {
                    PrimaryUseCategoryName = "Legal Status 2",
                    Flow = 6,
                    Volume = 8,
                    Points = 2,
                }
            };

            using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.LegalStatus);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task GetAnalyticsSummary_CalculateAnalyticsCorrectlyForSiteType()
        {
            //Arrange
            var siteTypes = new EF.SiteType[]
            {
                new SiteTypeFaker()
                    .RuleFor(st => st.Name, () => "site name 1")
                    .RuleFor(st => st.WaDEName, () => "wadename1")
                    .Generate(),
                new SiteTypeFaker()
                    .RuleFor(st => st.Name, () => "site name 2")
                    .RuleFor(st => st.WaDEName, () => "wadename2")
                    .Generate(),
            };

            var allocationAmountsFacts = siteTypes.Select((siteType, idx) =>
            {
                return new AllocationAmountFactFaker()
                    .RuleFor(a => a.AllocationFlow_CFS, () => 1)
                    .RuleFor(a => a.AllocationVolume_AF, () => 2)
                    .RuleFor(a => a.AllocationBridgeSitesFact, () => new AllocationBridgeSiteFactFaker()
                        .RuleFor(absf => absf.Site, () => new SitesDimFaker()
                            .RuleFor(site => site.SiteTypeCvNavigation, () => siteType)
                            .Generate())
                        .Generate(1)
                    )
                    .Generate(idx + 1);
            })
            .SelectMany(array => array)
            .ToArray();

            var expected = new AnalyticsSummaryInformation[]
            {
                new()
                {
                    PrimaryUseCategoryName = "wadename1",
                    Flow = 1,
                    Points = 1,
                    Volume = 2,
                },
                new()
                {
                    PrimaryUseCategoryName = "wadename2",
                    Flow = 2,
                    Points = 2,
                    Volume = 4,
                },
            };

            await using (var db = CreateDatabaseContextFactory().Create())
            {
                await db.AllocationAmountsFact.AddRangeAsync(allocationAmountsFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetAnalyticsSummaryInformation(new WaterRightsSearchCriteria(), Common.AnalyticsInformationGrouping.SiteType);

            //Assert
            results.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        [DataRow(1, 1)]
        [DataRow(3, 1)]
        [DataRow(1, 3)]
        [DataRow(3, 3)]
        public async Task GetWaterRightsEnvelope_HasSiteGeometries(int allocationCount, int sitesPerAllocation)
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var sites = new SitesDimFaker()
                .Generate(allocationCount * sitesPerAllocation)
                .ToArray();
            for (var i = 0; i < allocationCount; i++)
            {
                var allocations = new AllocationAmountFactFaker()
                    .LinkSites(sites.Skip(i * sitesPerAllocation).Take(sitesPerAllocation).ToArray())
                    .Generate();
                allocationAmountFacts.Add(allocations);
            }

            await using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                await db.SaveChangesAsync();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria { });

            Console.Write(results.ToString());

            //Assert
            results.Should().NotBeNull();
            foreach (var site in sites)
            {
                results.Covers(site.Geometry).Should().BeTrue();
            }
        }

        [TestMethod]
        [DataRow(1, 1)]
        [DataRow(3, 1)]
        [DataRow(1, 3)]
        [DataRow(3, 3)]
        public async Task GetWaterRightsEnvelope_HasSiteWithSitePoints(int allocationCount, int sitesPerAllocation)
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var sites = new SitesDimFaker()
                .RuleFor(a => a.Geometry, () => null)
                .RuleFor(a => a.SitePoint, () => new PointFaker().Generate())
                .Generate(allocationCount * sitesPerAllocation)
                .ToArray();
            for (var i = 0; i < allocationCount; i++)
            {
                var allocations = new AllocationAmountFactFaker()
                   .LinkSites(sites.Skip(i * sitesPerAllocation).Take(sitesPerAllocation).ToArray())
                   .Generate();
                allocationAmountFacts.Add(allocations);
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria { });

            //Assert
            results.Should().NotBeNull();
            foreach (var site in sites)
            {
                results.Covers(site.SitePoint).Should().BeTrue();
            }
        }

        [TestMethod]
        public async Task GetWaterRightsEnvelope_NoSites()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var allocations = new AllocationAmountFactFaker()
                   .Generate();
            allocationAmountFacts.Add(allocations);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria { });

            //Assert
            results.Should().BeNull();
        }

        [TestMethod]
        public async Task GetWaterRightsEnvelope_HasSiteWithoutGeometries()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var site = new SitesDimFaker()
                .RuleFor(a => a.Geometry, () => null)
                .RuleFor(a => a.SitePoint, () => null)
                .Generate();
            var allocations = new AllocationAmountFactFaker()
                .LinkSites(site)
                .Generate();
            allocationAmountFacts.Add(allocations);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria { });

            //Assert
            results.Should().BeNull();
        }

        [TestMethod]
        public async Task GetWaterRightsEnvelope_HasSiteWithMultiPolygon()
        {
            //Arrange
            List<EF.AllocationAmountsFact> allocationAmountFacts = new List<EF.AllocationAmountsFact>();

            var site = new SitesDimFaker()
                .RuleFor(a => a.Geometry, () => new MultiPolygonFaker().Generate())
                .Generate();
            var allocations = new AllocationAmountFactFaker()
                .LinkSites(site)
                .Generate();
            allocationAmountFacts.Add(allocations);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria { });

            //Assert
            results.Should().NotBeNull();
            results.Covers(site.Geometry).Should().BeTrue();
        }

        [TestMethod]
        [DataRow(true)]
        [DataRow(false)]
        public async Task GetWaterRightsEnvelope_Criteria_AllocationOwner(bool matches)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationOwner, f => f.Person.FullName)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }
            allocation.AllocationOwner.Should().NotBeNullOrEmpty("Validate Faker Setup Component Correctly");

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                AllocationOwner = matches ? allocation.AllocationOwner : "doesn't match"
            });

            //Assert
            if (matches)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow("test", new string[0], true)]
        [DataRow("test", new string[] { "test" }, true)]
        [DataRow("test", new string[] { "test", "another" }, true)]
        [DataRow("test", new string[] { "another", "test" }, true)]
        [DataRow("test", new string[] { "another" }, false)]
        public async Task GetWaterRightsEnvelope_Criteria_BeneficialUses(string allocationBeneficialUse, string[] criteriaBeneficialUses, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.PrimaryBeneficialUseCategory, f => allocationBeneficialUse)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                BeneficialUses = criteriaBeneficialUses
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, false, true)]
        [DataRow(null, true, false)]
        [DataRow(false, null, true)]
        [DataRow(false, false, true)]
        [DataRow(false, true, false)]
        [DataRow(true, null, true)]
        [DataRow(true, false, false)]
        [DataRow(true, true, true)]
        public async Task GetWaterRightsEnvelope_Criteria_ExemptOfVolumeFlowPriority(bool? allocationExempt, bool? criteriaExempt, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.ExemptOfVolumeFlowPriority, f => allocationExempt)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                ExemptOfVolumeFlowPriority = criteriaExempt
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, 1.0, false)]
        [DataRow(1.0, null, true)]
        [DataRow(1.0, 0.9, true)]
        [DataRow(1.0, 1.0, true)]
        [DataRow(1.0, 1.1, false)]
        public async Task GetWaterRightsEnvelope_Criteria_MinimumFlow(double? allocationFlow, double? criteriaMinimumFlow, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationFlow_CFS, f => allocationFlow)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                MinimumFlow = criteriaMinimumFlow
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, 1.0, false)]
        [DataRow(1.0, null, true)]
        [DataRow(1.0, 0.9, false)]
        [DataRow(1.0, 1.0, true)]
        [DataRow(1.0, 1.1, true)]
        public async Task GetWaterRightsEnvelope_Criteria_MaximumFlow(double? allocationFlow, double? criteriaMaximumFlow, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationFlow_CFS, f => allocationFlow)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                MaximumFlow = criteriaMaximumFlow
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, 1.0, false)]
        [DataRow(1.0, null, true)]
        [DataRow(1.0, 0.9, true)]
        [DataRow(1.0, 1.0, true)]
        [DataRow(1.0, 1.1, false)]
        public async Task GetWaterRightsEnvelope_Criteria_MinimumVolume(double? allocationVolume, double? criteriaMinimumVolume, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationVolume_AF, f => allocationVolume)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                MinimumVolume = criteriaMinimumVolume
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, 1.0, false)]
        [DataRow(1.0, null, true)]
        [DataRow(1.0, 0.9, false)]
        [DataRow(1.0, 1.0, true)]
        [DataRow(1.0, 1.1, true)]
        public async Task GetWaterRightsEnvelope_Criteria_MaximumVolume(double? allocationVolume, double? criteriaMaximumVolume, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationVolume_AF, f => allocationVolume)
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                MaximumVolume = criteriaMaximumVolume
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow("uuid1", new string[0], true)]
        [DataRow("uuid1", new string[] { "uuid1" }, true)]
        [DataRow("uuid1", new string[] { "uuid1", "uuid2" }, true)]
        [DataRow("uuid1", new string[] { "uuid2", "uuid1" }, true)]
        [DataRow("uuid1", new string[] { "uuid2" }, false)]
        public async Task GetWaterRightsEnvelope_Criteria_WadeSitesUuids(string allocationSiteUuid, string[] criteriaSiteUuid, bool shouldMatch)
        {
            //Arrange
            var site = new SitesDimFaker()
                .RuleFor(a => a.SiteUuid, () => allocationSiteUuid)
                .Generate();
            var allocation = new AllocationAmountFactFaker()
                .LinkSites(site)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocation);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var results = await accessor.GetWaterRightsEnvelope(new WaterRightsSearchCriteria
            {
                WadeSitesUuids = criteriaSiteUuid
            });

            //Assert
            if (shouldMatch)
            {
                results.Should().NotBeNull();
                results.Covers(site.Geometry).Should().BeTrue();
            }
            else
            {
                results.Should().BeNull();
            }
        }

        [TestMethod]
        [DataRow(500, 5, DisplayName = "5 pages even")]
        [DataRow(225, 3, DisplayName = "3 pages, uneven")]
        [DataRow(301, 4, DisplayName = "1 result on last page")]
        [DataRow(100, 1, DisplayName = "1 page even")]
        [DataRow(44, 1, DisplayName = "1 page not full")]
        [DataRow(99, 1, DisplayName = "1 less than full page")]
        public async Task FindWaterRights_Pagination_PageThroughResults(int numberOfResults, int numberOfPages)
        {
            //Arrange
            var allocationAmountFacts = new AllocationAmountFactFaker()
                .IncludeAllocationPriorityDate()
                .Generate(numberOfResults);
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            var orderedAllocationAmountsFacts = allocationAmountFacts
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationAmountId)
                .ToList();

            //Act
            var results = new List<WaterRightsSearchResults>();

            var accessor = CreateWaterAllocationAccessor();

            for (var i = 0; i < numberOfPages; i++)
            {
                var searchCriteria = new CommonContracts.WaterRightsSearchCriteria();

                results.Add(await accessor.FindWaterRights(searchCriteria, i));
            }

            var expectedResults = DtoMapper.Map<List<WaterRightsSearchDetail>>(orderedAllocationAmountsFacts);

            //Assert
            for (var i = 0; i < numberOfPages; i++)
            {
                var expected = expectedResults.Skip(i * 100).Take(100);
                results[i].WaterRightsDetails.Should().BeEquivalentTo(expected);
                results[i].HasMoreResults.Should().Be(i < numberOfPages - 1);//should be true expect the last one
            }
        }

        [TestMethod]
        public async Task FindWaterRights_IgnoresNullDates()
        {
            //Arrange
            var allocationAmountFacts = new AllocationAmountFactFaker()
                .Generate(5);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var result = await accessor.FindWaterRights(new WaterRightsSearchCriteria { States = new string[] { } }, 0);

            //Assert
            foreach (var res in result.WaterRightsDetails)
            {
                res.AllocationPriorityDate.Should().BeNull();
            }
        }

        [TestMethod]
        public async Task FindWaterRights_IgnoresDefaultDates()
        {
            //Arrange
            var allocationAmountFacts = new AllocationAmountFactFaker()
                .IncludeAllocationPriorityDefaultDate()
                .Generate(5);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var result = await accessor.FindWaterRights(new WaterRightsSearchCriteria { States = new string[] { } }, 0);

            //Assert
            foreach (var res in result.WaterRightsDetails)
            {
                res.AllocationPriorityDate.Should().BeNull();
            }
        }

        [TestMethod]
        public async Task FindWaterRights_Pagination_HasMoreResults()
        {
            //Arrange
            var allocationAmountFacts = new AllocationAmountFactFaker()
                .IncludeAllocationPriorityDate()
                .Generate(500);
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmountFacts);
                db.SaveChanges();
            }

            var orderedAllocationAmountsFacts = allocationAmountFacts
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationAmountId)
                .ToList();

            //Act
            var results = new List<WaterRightsSearchResults>();

            var accessor = CreateWaterAllocationAccessor();

            for (var i = 0; i < 5; i++)
            {
                var searchCriteria = new CommonContracts.WaterRightsSearchCriteria();

                results.Add(await accessor.FindWaterRights(searchCriteria, i));
            }

            var expectedResults = DtoMapper.Map<List<WaterRightsSearchDetail>>(orderedAllocationAmountsFacts);

            //Assert
            for (var i = 0; i < 5; i++)
            {
                var expected = expectedResults.Skip(i * 100).Take(100);
                results[i].WaterRightsDetails.Should().BeEquivalentTo(expected);
            }
        }

        [TestMethod]
        public async Task FindWaterRights_PagedSearchResults_GetNextPage()
        {
            //Arrange
            var beneficialUse = new BeneficialUsesCVFaker().Generate();
            beneficialUse.WaDEName = "beneficialUseWadeName";
            beneficialUse.Name = "beneficialUseName";

            var allocationAmountFactFaker = new AllocationAmountFactFaker();

            var matchingAllocationAmountFacts = allocationAmountFactFaker
                .IncludeAllocationPriorityDate()
                .LinkBeneficialUses(beneficialUse)
                .Generate(250);

            matchingAllocationAmountFacts.ForEach(x => x.PrimaryBeneficialUseCategory = "beneficialUseWadeName");

            var nonMatchBeneficalUse = new BeneficialUsesCVFaker().Generate();

            var nonMatchingAllocationAmountFacts = allocationAmountFactFaker
                .IncludeAllocationPriorityDate()
                .LinkBeneficialUses(nonMatchBeneficalUse)
                .Generate(200);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchingAllocationAmountFacts);
                db.AllocationAmountsFact.AddRange(nonMatchingAllocationAmountFacts);
                db.SaveChanges();
            }

            var orderedAllocationAmountsFacts = matchingAllocationAmountFacts
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationAmountId)
                .ToList();

            var searchCriteria = new WaterRightsSearchCriteria
            {
                BeneficialUses = new[] { "beneficialUseWadeName" }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();

            var result = await accessor.FindWaterRights(searchCriteria, 2);

            var expectedResults = DtoMapper.Map<List<WaterRightsSearchDetail>>(orderedAllocationAmountsFacts);

            //Assert
            result.CurrentPageNumber.Should().Be(2);
            result.WaterRightsDetails.Should().HaveCount(50);

            var expected = expectedResults.Skip(2 * 100).Take(100);
            result.WaterRightsDetails.Should().BeEquivalentTo(expected);
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByNldiIds_SingleAllocation()
        {
            // Arrange
            Random rnd = new();
            var randomBetween1And100 = rnd.Next(1, 100);

            var idList = new List<string>();

            for (var i = 0; i < randomBetween1And100; i++)
            {
                idList.Add(Guid.NewGuid().ToString());
            }

            var ids = idList.ToArray();
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(ids.Length);

            for (var i = 0; i < sites.Count; i++)
            {
                sites[i].SiteUuid = ids[i];
            }

            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                WadeSitesUuids = ids
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.WaterRightsDetails.Count().Should().Be(1);
            result.WaterRightsDetails.FirstOrDefault().AllocationUuid.Should().Be(allocationAmount.AllocationUuid);
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByNldiIds_MultipleAllocation()
        {
            // Arrange
            Random rnd = new();
            var randomBetween1And100 = rnd.Next(1, 100);

            var idList = new List<string>();

            for (var i = 0; i < randomBetween1And100; i++)
            {
                idList.Add(Guid.NewGuid().ToString());
            }

            var ids = idList.ToArray();
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(ids.Length);

            for (var i = 0; i < sites.Count; i++)
            {
                sites[i].SiteUuid = ids[i];
            }

            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmounts = new AllocationAmountFactFaker().Generate(ids.Length);
            db.AllocationAmountsFact.AddRange(allocationAmounts);
            db.SaveChanges();

            for (var i = 0; i < sites.Count; i++)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmounts[i].AllocationAmountId, sites[i].SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                WadeSitesUuids = ids
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.WaterRightsDetails.Count().Should().Be(ids.Length);
            result.WaterRightsDetails.All(w => allocationAmounts.Any(a => a.AllocationUuid == w.AllocationUuid)).Should().BeTrue();
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByNldiIds_MatchesFromMultipleAllocation()
        {
            // Arrange
            Random rnd = new();
            var randomBetween1And100 = rnd.Next(1, 100);

            var idList = new List<string>();

            for (var i = 0; i < randomBetween1And100; i++)
            {
                idList.Add(Guid.NewGuid().ToString());
            }

            var ids = idList.ToArray();
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(ids.Length);

            for (var i = 0; i < sites.Count; i++)
            {
                sites[i].SiteUuid = ids[i];
            }

            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmounts = new AllocationAmountFactFaker().Generate(ids.Length);
            db.AllocationAmountsFact.AddRange(allocationAmounts);
            db.SaveChanges();

            for (var i = 0; i < sites.Count; i++)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmounts[i].AllocationAmountId, sites[i].SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            var unmathchingsites = new SitesDimFaker().Generate(10);

            db.SitesDim.AddRange(unmathchingsites);
            db.SaveChanges();

            var unmatchingAllocations = new AllocationAmountFactFaker().Generate(10);
            db.AllocationAmountsFact.AddRange(unmatchingAllocations);
            db.SaveChanges();

            for (var i = 0; i < unmathchingsites.Count; i++)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(unmatchingAllocations[i].AllocationAmountId, unmathchingsites[i].SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                WadeSitesUuids = ids
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.WaterRightsDetails.Count().Should().Be(ids.Length);
            result.WaterRightsDetails.All(w => allocationAmounts.Any(a => a.AllocationUuid == w.AllocationUuid)).Should().BeTrue();
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByBeneficalUse_ReturnsOneMatch()
        {
            // Arrange
            var expectedName = "expectedName";

            var beneficialUse = new BeneficialUsesCVFaker().Generate();
            beneficialUse.WaDEName = expectedName;
            beneficialUse.Name = "name2";

            var matchingAllocationAmountFacts = new AllocationAmountFactFaker(expectedName)
                .LinkBeneficialUses(beneficialUse)
                .Generate();
            var nonMatchingAllocationAmountFacts = new AllocationAmountFactFaker(Guid.NewGuid().ToString())
                .LinkBeneficialUses(new BeneficialUsesCVFaker().Generate(1).ToArray())
                .Generate(3);
            nonMatchingAllocationAmountFacts.AddRange(new AllocationAmountFactFaker()
                .Generate(3));
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(matchingAllocationAmountFacts);
                db.AllocationAmountsFact.AddRange(nonMatchingAllocationAmountFacts);
                db.SaveChanges();
            }

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                BeneficialUses = new[] { expectedName }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.WaterRightsDetails.Count().Should().Be(1);
            result.WaterRightsDetails.FirstOrDefault().BeneficialUses.Should().Contain(expectedName);
        }

        [TestMethod]
        [DataRow("expectedName", "name2", "expectedName")]
        [DataRow("", "expectedName", "expectedName")]
        public async Task FindWaterRights_OwnerClassification_MatchByWadeNameOrName(string ownerClassificationWadeName, string ownerClassificationName, string searchInput)
        {
            // Arrange
            var allocationAmounts = new AllocationAmountFactFaker()
                .IncludeOwnerClassification()
                .Generate(4);

            allocationAmounts[2].OwnerClassificationCV = ownerClassificationName;
            allocationAmounts[2].OwnerClassification.WaDEName = ownerClassificationWadeName;
            allocationAmounts[2].OwnerClassification.Name = ownerClassificationName;

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuid = allocationAmounts[2].AllocationUuid;

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                OwnerClassifications = new[] { searchInput }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.WaterRightsDetails.Count().Should().Be(1);
            result.WaterRightsDetails.FirstOrDefault().AllocationUuid.Should().Be(expectedAllocationUuid);
            result.WaterRightsDetails.FirstOrDefault().OwnerClassification.Should().Be(searchInput);
        }

        [TestMethod]
        [DataRow(10, 0, new string[] { "expectedName0", "expectedName1" })]
        [DataRow(4, 1, new string[] { "expectedName0", "expectedName1" })]
        [DataRow(10, 2, new string[] { "expectedName0", "expectedName1", "expectedName2" })]
        [DataRow(10, 4, new string[] { "expectedName0" })]
        public async Task FindWaterRights_SearchByOwnerClassification_ReturnsMatches(int totalRecordCount, int expectedResultCount, string[] searchInputs)
        {
            // Arrange
            var rand = new Random();

            var expectedResults = new List<(string allocationUuid, string ownerClassification)>();

            var ownerClassificationCVs = new List<EF.OwnerClassificationCv>();

            // generate ownerClassificationsCV objects that match search inputs
            foreach (var input in searchInputs)
            {
                var ownerClassificationFake = new OwnerClassificationCvFaker().Generate();
                ownerClassificationFake.WaDEName = input;
                ownerClassificationFake.Name = input;

                ownerClassificationCVs.Add(ownerClassificationFake);
            }

            var allocationAmounts = new AllocationAmountFactFaker().Generate(totalRecordCount);

            // assign the ownerClassifications
            for (int i = 0; i < expectedResultCount; i++)
            {
                var input = searchInputs[rand.Next(0, searchInputs.Length)];

                allocationAmounts[i].OwnerClassificationCV = input;
                allocationAmounts[i].OwnerClassification = ownerClassificationCVs.First(x => x.WaDEName == input);
            }

            // create additional random ownerClassifications
            for (int i = expectedResultCount; i < totalRecordCount; i++)
            {
                var ownerClassificationFake = new OwnerClassificationCvFaker().Generate();
                allocationAmounts[i].OwnerClassificationCV = ownerClassificationFake.Name;
                allocationAmounts[i].OwnerClassification = ownerClassificationFake;
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmounts);
                db.SaveChanges();
            }

            expectedResults.AddRange(allocationAmounts
                .Take(expectedResultCount)
                .Select(x => (allocationUuid: x.AllocationUuid, ownerClassification: x.OwnerClassification.WaDEName)));

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                OwnerClassifications = searchInputs
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            expectedResults.Count.Should().Be(expectedResultCount);

            result.WaterRightsDetails.Count().Should().Be(expectedResultCount);

            expectedResults.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected.allocationUuid) != null)
                .Should().BeTrue();

            foreach (var expectedResult in expectedResults)
            {
                var waterRight = result.WaterRightsDetails.FirstOrDefault(actual => actual.AllocationUuid == expectedResult.allocationUuid);
                waterRight.Should().NotBeNull();
                searchInputs.Should().Contain(waterRight.OwnerClassification);
            }
        }

        [TestMethod]
        [DataRow("expectedName", "name2", "expectedName", true)]
        [DataRow("", "expectedName", "expectedName", true)]
        [DataRow("", "name2", "expectedName", false)]
        [DataRow("name2", "expectedName", "expectedName", false)]
        public async Task FindWaterRights_WaterSourceTypes_MatchByWadeNameOrName(string waterSourceTypeWadeName, string waterSourceTypeName, string searchInput, bool shouldMatch)
        {
            // Arrange
            var waterSourceType = new WaterSourceTypeFaker().Generate();
            waterSourceType.WaDEName = waterSourceTypeWadeName;
            waterSourceType.Name = waterSourceTypeName;

            var waterSourceFake = new WaterSourceDimFaker().Generate();
            waterSourceFake.WaterSourceTypeCv = waterSourceTypeName;
            waterSourceFake.WaterSourceTypeCvNavigation = waterSourceType;

            var siteFake = new SitesDimFaker()
                    .LinkWaterSources(waterSourceFake)
                    .Generate();

            var allocationAmounts = new AllocationAmountFactFaker().Generate(3);
            allocationAmounts.Add(new AllocationAmountFactFaker()
                    .LinkSites(siteFake)
                    .Generate());

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(allocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuid = allocationAmounts[3].AllocationUuid;

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                WaterSourceTypes = new[] { searchInput }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            if (shouldMatch)
            {
                result.WaterRightsDetails.Count().Should().Be(1);
                result.WaterRightsDetails.FirstOrDefault().AllocationUuid.Should().Be(expectedAllocationUuid);
            }
            else
            {
                result.WaterRightsDetails.Should().BeEmpty();
            }

        }

        [TestMethod]
        [DataRow(10, 0, new string[] { "expectedName0", "expectedName1" })]
        [DataRow(4, 1, new string[] { "expectedName0", "expectedName1" })]
        [DataRow(10, 2, new string[] { "expectedName0", "expectedName1", "expectedName2" })]
        [DataRow(10, 4, new string[] { "expectedName0" })]
        public async Task FindWaterRights_SearchByWaterSourceTypes_ReturnsMatches(int totalRecordCount, int expectedResultCount, string[] searchInputs)
        {
            // Arrange
            var rand = new Random();

            var expectedResults = new List<string>();

            var waterSourceTypes = new List<EF.WaterSourceType>();

            // generate waterSourceType objects that match search inputs
            foreach (var input in searchInputs)
            {
                var waterSourceType = new WaterSourceTypeFaker().Generate();
                waterSourceType.WaDEName = input;
                waterSourceType.Name = input;

                waterSourceTypes.Add(waterSourceType);
            }

            var matchingAllocationAmounts = new List<EF.AllocationAmountsFact>();

            // generate waterSource objects that match search inputs
            for (int i = 0; i < expectedResultCount; i++)
            {
                var input = searchInputs[rand.Next(0, searchInputs.Length)];
                var waterSourceFake = new WaterSourceDimFaker().Generate();
                waterSourceFake.WaterSourceTypeCv = input;
                waterSourceFake.WaterSourceTypeCvNavigation = waterSourceTypes.First(x => x.WaDEName == input);

                var siteFake = new SitesDimFaker()
                    .LinkWaterSources(waterSourceFake)
                    .Generate();

                matchingAllocationAmounts.Add(new AllocationAmountFactFaker()
                    .LinkSites(siteFake)
                    .Generate());
            }

            // generate waterSource objects that don't match
            var notMatchingAllocationAmounts = new AllocationAmountFactFaker()
                .LinkSites(new SitesDimFaker()
                    .LinkWaterSources(new WaterSourceDimFaker().Generate(3).ToArray())
                    .Generate(1).ToArray()
                    )
                .Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchingAllocationAmounts);
                db.AllocationAmountsFact.AddRange(notMatchingAllocationAmounts);
                db.SaveChanges();
            }

            expectedResults.AddRange(matchingAllocationAmounts.Select(x => x.AllocationUuid));

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                WaterSourceTypes = searchInputs
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            expectedResults.Count.Should().Be(expectedResultCount);

            result.WaterRightsDetails.Count().Should().Be(expectedResultCount);

            expectedResults.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected) != null)
                .Should().BeTrue();

            foreach (var expectedResult in expectedResults)
            {
                var waterRight = result.WaterRightsDetails.FirstOrDefault(actual => actual.AllocationUuid == expectedResult);
                waterRight.Should().NotBeNull();
            }
        }

        [TestMethod]
        [DataRow(10, 0, new string[] { "ZZ" })]
        [DataRow(5, 5, null)]
        [DataRow(5, 5, new string[] { "XX", "ZZ" })]
        [DataRow(10, 2, new string[] { "YY", "NN", "ZZ" })]
        public async Task FindWaterRights_SearchByStates_ReturnsMatches(int totalRecordCount, int expectedResultCount, string[] searchInputs)
        {
            //Arrange
            var rand = new Random();

            var matchedOrganizations = new List<EF.OrganizationsDim>();

            if (searchInputs != null && searchInputs.Length > 0)
            {
                // generate an orgainization for each search param
                foreach (var input in searchInputs ?? Array.Empty<string>())
                {
                    var organizationFake = new OrganizationsDimFaker().Generate();
                    organizationFake.State = input;

                    matchedOrganizations.Add(organizationFake);
                }
            }
            else
            {
                matchedOrganizations.AddRange(new OrganizationsDimFaker().Generate(5));
            }

            var matchedAllocationAmounts = new List<EF.AllocationAmountsFact>();

            for (int i = 0; i < expectedResultCount; i++)
            {
                var organization = matchedOrganizations[rand.Next(0, matchedOrganizations.Count)];
                var allocationAmount = new AllocationAmountFactFaker()
                    .LinkOrganization(organization).Generate();

                matchedAllocationAmounts.Add(allocationAmount);
            }

            var nonMatchedOrgizations = new List<EF.OrganizationsDim>(new OrganizationsDimFaker().Generate(5));

            var nonMatchedAllocationAmounts = new List<EF.AllocationAmountsFact>();
            for (int i = 0; i < totalRecordCount - expectedResultCount; i++)
            {
                var organization = nonMatchedOrgizations[rand.Next(0, nonMatchedOrgizations.Count)];
                nonMatchedAllocationAmounts.Add(new AllocationAmountFactFaker()
                    .LinkOrganization(organization).Generate());
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                States = searchInputs
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);
            result.WaterRightsDetails.All(x => !string.IsNullOrWhiteSpace(x.AllocationUuid) && x.AllocationUuid != "0").Should().BeTrue();

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByStateAndBeneficailUse_ReturnsMatches()
        {
            var organizationFake = new OrganizationsDimFaker().Generate();
            organizationFake.State = "ZZ";

            var beneficialUse = new BeneficialUsesCVFaker().Generate();
            beneficialUse.WaDEName = "searchName";
            beneficialUse.Name = "searchName";

            var matchedAllocationAmount = new AllocationAmountFactFaker("searchName")
                    .LinkBeneficialUses(beneficialUse)
                    .LinkOrganization(organizationFake).Generate();

            var nonMatchedAllocationAmount = new AllocationAmountFactFaker()
                .LinkBeneficialUses(new BeneficialUsesCVFaker().Generate())
                .LinkOrganization(new OrganizationsDimFaker().Generate())
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmount);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmount);
                db.SaveChanges();
            }

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                States = new[] { "ZZ" },
                BeneficialUses = new[] { "searchName" }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().HaveCount(1);
            result.WaterRightsDetails[0].AllocationUuid.Should().Be(matchedAllocationAmount.AllocationUuid);
            result.WaterRightsDetails[0].BeneficialUses.Should().Contain("searchName");
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByPodOrPouAndMaximumVolume_ReturnsMatches()
        {
            var matchedSite = new SitesDimFaker().Generate();
            matchedSite.PODorPOUSite = "pou";

            var matchedAllocationAmount = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationVolume_AF, 2000)
                .LinkSites(matchedSite)
                .Generate();

            var nonMatchedAllocationAmount = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationVolume_AF, 10000)
                .LinkSites(new SitesDimFaker().Generate())
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmount);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmount);
                db.SaveChanges();
            }

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                PodOrPou = "pou",
                MaximumVolume = 3000
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().HaveCount(1);
            result.WaterRightsDetails[0].AllocationUuid.Should().NotBeNull();
            result.WaterRightsDetails[0].AllocationUuid.Should().Be(matchedAllocationAmount.AllocationUuid);
            result.WaterRightsDetails[0].AllocationVolumeAf.Should().Be(2000);
        }

        [TestMethod]
        public async Task FindWaterRights_LegalStatusMapped_NameOrWadeName()
        {
            var matchedAllocationAmountWithWadeName = new AllocationAmountFactFaker()
                .IncludeLegalStatus()
                .Generate();

            var legalStatusNoWadeName = new LegalStatusCVFaker().Generate();
            legalStatusNoWadeName.WaDEName = null;

            var matchedAllocationAmountNoWadeName = new AllocationAmountFactFaker().Generate();
            matchedAllocationAmountNoWadeName.AllocationLegalStatusCv = legalStatusNoWadeName.Name;
            matchedAllocationAmountNoWadeName.AllocationLegalStatusCvNavigation = legalStatusNoWadeName;

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(matchedAllocationAmountWithWadeName);
                db.AllocationAmountsFact.Add(matchedAllocationAmountNoWadeName);
                db.SaveChanges();
            }

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria();

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().HaveCount(2);
            result.WaterRightsDetails.First(x => x.AllocationUuid == matchedAllocationAmountWithWadeName.AllocationUuid)
                .AllocationLegalStatus.Should().Be(matchedAllocationAmountWithWadeName.AllocationLegalStatusCvNavigation.WaDEName);
            result.WaterRightsDetails.First(x => x.AllocationUuid == matchedAllocationAmountNoWadeName.AllocationUuid)
                .AllocationLegalStatus.Should().Be(matchedAllocationAmountNoWadeName.AllocationLegalStatusCvNavigation.Name);

        }

        [TestMethod]
        [DataRow(10, 0, "ownerName")]
        [DataRow(5, 5, "ownerName")]
        [DataRow(10, 2, "ownerName")]
        public async Task FindWaterRights_SearchByAllocationOwner_ExactMatches(int totalRecordCount, int expectedResultCount, string searchInput)
        {
            //Arrange
            var matchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationOwner, () => searchInput)
                .Generate(expectedResultCount);

            //generate non-matching allocationAmounts
            var nonMatchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationOwner, f => f.Random.String(20, 'A', 'z'))
                .Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                AllocationOwner = searchInput
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(10, 0, "ownerName")]
        [DataRow(5, 5, "ownerName")]
        [DataRow(10, 2, "ownerName")]
        public async Task FindWaterRights_SearchByAllocationOwner_StringContainsMatches(int totalRecordCount, int expectedResultCount, string searchInput)
        {
            //Arrange
            var matchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationOwner, f => $"{f.Random.AlphaNumeric(5)}{searchInput}{f.Random.AlphaNumeric(5)}")
                .Generate(expectedResultCount);

            //generate non-matching allocationAmounts
            var nonMatchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationOwner, f => f.Random.AlphaNumeric(20))
                .Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                await db.SaveChangesAsync();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                AllocationOwner = searchInput
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(null, null, true)]
        [DataRow(null, true, false)]
        [DataRow(null, false, true)]
        [DataRow(true, null, true)]
        [DataRow(true, true, true)]
        [DataRow(true, false, false)]
        [DataRow(false, null, true)]
        [DataRow(false, true, false)]
        [DataRow(false, false, true)]
        public async Task FindWaterRights_SearchByExemptOfVolumeFlowPriority(bool? recordExempt, bool? queryExempt, bool shouldReturn)
        {
            //Arrange
            var dbAllocationAmount = new AllocationAmountFactFaker()
                .SetExemptOfVolumeFlowPriority(recordExempt)
                .Generate();

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(dbAllocationAmount);
                db.SaveChanges();
            }

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                ExemptOfVolumeFlowPriority = queryExempt
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            if (shouldReturn)
            {
                result.WaterRightsDetails.Should().HaveCount(1);
                result.WaterRightsDetails[0].AllocationUuid.Should().Be(dbAllocationAmount.AllocationUuid);
            }
            else
            {
                result.WaterRightsDetails.Should().BeEmpty();
            }
        }

        [TestMethod]
        [DataRow(5, 5, null, null)]
        [DataRow(10, 0, null, 20d)]
        [DataRow(5, 5, 10d, 10000d)]
        [DataRow(10, 2, 500d, 50000d)]
        [DataRow(10, 3, null, 50000d)]
        [DataRow(10, 3, 200d, null)]
        public async Task FindWaterRights_SearchByFlowRate_ReturnsMatches(int totalRecordCount, int expectedResultCount, double? minimumFlow, double? maximumFlow)
        {
            //Arrange
            var rand = new Random();

            var matchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationFlow_CFS, f => f.Random.Double(minimumFlow.HasValue ? minimumFlow.Value : 1, maximumFlow.HasValue ? maximumFlow.Value : double.MaxValue))
                .Generate(expectedResultCount);

            //generate non-matching allocationAmounts
            var nonMatchFaker = new AllocationAmountFactFaker();
            if (minimumFlow.HasValue)
            {
                nonMatchFaker.RuleFor(x => x.AllocationFlow_CFS, f => f.Random.Double(1, minimumFlow.Value - 1));
            }
            else if (maximumFlow.HasValue)
            {
                nonMatchFaker.RuleFor(x => x.AllocationFlow_CFS, f => f.Random.Double(maximumFlow.Value, double.MaxValue));
            }

            var nonMatchedAllocationAmounts = nonMatchFaker.Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => new
            {
                AllocationUuid = x.AllocationUuid,
                AllocationFlowCfs = x.AllocationFlow_CFS
            }).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                MinimumFlow = minimumFlow,
                MaximumFlow = maximumFlow
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(
                actual => actual.AllocationUuid == expected.AllocationUuid && actual.AllocationFlowCfs == expected.AllocationFlowCfs) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(5, 5, null, null)]
        [DataRow(10, 0, null, 20d)]
        [DataRow(5, 5, 10d, 10000d)]
        [DataRow(10, 2, 500d, 50000d)]
        [DataRow(10, 3, null, 50000d)]
        [DataRow(10, 3, 200d, null)]
        public async Task FindWaterRights_SearchByVolume_ReturnsMatches(int totalRecordCount, int expectedResultCount, double? minimumVolume, double? maximumVolume)
        {
            //Arrange
            var rand = new Random();

            var matchedAllocationAmounts = new AllocationAmountFactFaker()
                .RuleFor(x => x.AllocationVolume_AF, f => f.Random.Double(minimumVolume.HasValue ? minimumVolume.Value : 1, maximumVolume.HasValue ? maximumVolume.Value : double.MaxValue))
                .Generate(expectedResultCount);

            //generate non-matching allocationAmounts
            var nonMatchFaker = new AllocationAmountFactFaker();
            if (minimumVolume.HasValue)
            {
                nonMatchFaker.RuleFor(x => x.AllocationVolume_AF, f => f.Random.Double(1, minimumVolume.Value - 1));
            }
            else if (maximumVolume.HasValue)
            {
                nonMatchFaker.RuleFor(x => x.AllocationVolume_AF, f => f.Random.Double(maximumVolume.Value, double.MaxValue));
            }

            var nonMatchedAllocationAmounts = nonMatchFaker.Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => new
            {
                AllocationUuid = x.AllocationUuid,
                AllocationVolumeAf = x.AllocationVolume_AF
            }).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                MinimumVolume = minimumVolume,
                MaximumVolume = maximumVolume
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(
                actual => actual.AllocationUuid == expected.AllocationUuid && actual.AllocationVolumeAf == expected.AllocationVolumeAf) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(10, 0, "POD")]
        [DataRow(5, 5, "POU")]
        [DataRow(5, 5, null)]
        [DataRow(5, 5, "")]
        [DataRow(10, 2, "POD")]
        public async Task FindWaterRights_SearchByPodOrPou_ReturnsMatches(int totalRecordCount, int expectedResultCount, string searchInput)
        {
            //Arrange
            var matchedSite = new SitesDimFaker().Generate();
            matchedSite.PODorPOUSite = searchInput;

            var matchedAllocationAmounts = new AllocationAmountFactFaker()
                .LinkSites(matchedSite)
                .Generate(expectedResultCount);

            var nonMatchedSite = new SitesDimFaker().Generate();

            //generate non-matching allocationAmounts
            var nonMatchedAllocationAmounts = new AllocationAmountFactFaker()
                .LinkSites(nonMatchedSite)
                .Generate(totalRecordCount - expectedResultCount);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                PodOrPou = searchInput
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(actual => actual.AllocationUuid == expected) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(5, 5, null, null)]
        [DataRow(10, 0, null, "2022-06-07")]
        [DataRow(5, 5, "2017-06-07", "2022-06-07")]
        [DataRow(10, 2, "2010-06-07", "2022-06-07")]
        [DataRow(10, 3, null, "2022-06-07")]
        [DataRow(10, 3, "2019-06-07", null)]
        public async Task FindWaterRights_SearchByPriorityDate_ReturnsMatches(int totalRecordCount, int expectedResultCount, string minimumPriorityDateString, string maximumPriorityDateString)
        {
            DateTime? minimumPriorityDate = minimumPriorityDateString == null ? null : DateTime.Parse(minimumPriorityDateString);
            DateTime? maximumPriorityDate = maximumPriorityDateString == null ? null : DateTime.Parse(maximumPriorityDateString);

            //Arrange
            var date = minimumPriorityDate ?? new DateTime(1901, 1, 1);

            var matchedAllocationAmounts = Enumerable.Range(1, expectedResultCount)
                .Select(i =>
                {
                    var dateDimFaker = new DateDimFaker().RuleFor(a => a.Date, date.AddDays(i));
                    return new AllocationAmountFactFaker()
                        .RuleFor(a => a.AllocationPriorityDateNavigation, _ => dateDimFaker)
                        .RuleFor(a => a.AllocationPriorityDateID, () => null)
                        .Generate();
                })
                .ToList();

            var nonMatchingDate = minimumPriorityDate?.AddYears(-1)
                                  ?? maximumPriorityDate?.AddYears(1)
                                  ?? default;

            var nonMatchedAllocationAmounts = new AllocationAmountFactFaker()
                .SetAllocationPriorityDate(nonMatchingDate)
                .Generate(totalRecordCount - expectedResultCount);

            await using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                await db.SaveChangesAsync();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                MinimumPriorityDate = minimumPriorityDate,
                MaximumPriorityDate = maximumPriorityDate
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            result.WaterRightsDetails.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultCount);

            var expectedOrder = result.WaterRightsDetails.OrderBy(x => x.AllocationPriorityDate?.Date).ThenBy(x => x.AllocationUuid);

            result.WaterRightsDetails.Should().ContainInOrder(expectedOrder);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(
                actual => expected == actual.AllocationUuid) != null)
                .Should().BeTrue();

            result.WaterRightsDetails.All(x =>
                x.AllocationPriorityDate?.Date == matchedAllocationAmounts.First(a => a.AllocationUuid == x.AllocationUuid).AllocationPriorityDateNavigation.Date.Date)
                .Should().BeTrue();
            result.WaterRightsDetails.Should().BeInAscendingOrder(x => x.AllocationPriorityDate);
        }

        [TestMethod]
        [DataRow(2, null, "POINT(-96.7014 40.8146)", "POINT(-96.7014 40.8146)", "POINT(-96.7010 40.8146)", DisplayName = "same point")]
        [DataRow(0, null, "POINT(-96.7008 40.8147)", "POINT(-96.7014 40.8146)", "POINT(-96.7010 40.8146)", DisplayName = "different points")]
        [DataRow(2, null, "POINT(-96.7014 40.8146)", "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7010 40.8146)", DisplayName = "inside")]
        [DataRow(0, null, "POINT(-96.7014 40.8146)", "POLYGON((-96.7013 40.8147,-96.7012 40.8147,-96.7012 40.8146,-96.7013 40.8146,-96.7013 40.8147))", "POINT(-96.7010 40.8146)", DisplayName = "outside")]
        [DataRow(2, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7008 40.8146)", "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7010 40.8146)", DisplayName = "match geo not point")]
        [DataRow(2, "POLYGON((-96.7113 40.8147,-96.7112 40.8147,-96.7112 40.8146,-96.7113 40.8146,-96.7113 40.8147))", "POINT(-96.7014 40.8146)", "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7010 40.8146)", DisplayName = "match point not geo")]
        [DataRow(2, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7014 40.8146)", "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7010 40.8146)", DisplayName = "match both")]
        [DataRow(0, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POINT(-96.7014 40.8146)", "POLYGON((-96.7113 40.8147,-96.7112 40.8147,-96.7112 40.8146,-96.7113 40.8146,-96.7113 40.8147))", "POINT(-96.7010 40.8146)", DisplayName = "match neither")]
        public async Task FindWaterRights_SearchByGeometry_MatchOnSitePointOrGeometry(int expectedResultsCount, string siteGeometry, string sitePoint, string filterGeometry, string outsidePoint)
        {
            //Arrange
            var matchedAllocationAmounts = new List<EF.AllocationAmountsFact>();

            if (expectedResultsCount > 0)
            {
                var matchedSite = new SitesDimFaker()
                .RuleFor(s => s.SitePoint, () => GeometryHelpers.GetGeometryByWkt(sitePoint))
                .RuleFor(s => s.Geometry, () => GeometryHelpers.GetGeometryByWkt(siteGeometry))
                .Generate();

                matchedAllocationAmounts = new AllocationAmountFactFaker().LinkSites(matchedSite).Generate(expectedResultsCount);
            }

            var nonMatchedSite = new SitesDimFaker()
                .RuleFor(s => s.SitePoint, () => GeometryHelpers.GetGeometryByWkt(outsidePoint))
                .Generate();

            var nonMatchedAllocationAmounts = new AllocationAmountFactFaker().LinkSites(nonMatchedSite).Generate(3);

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var searchCriteria = new CommonContracts.WaterRightsSearchCriteria
            {
                FilterGeometry = new NetTopologySuite.Geometries.Geometry[] { GeometryHelpers.GetGeometryByWkt(filterGeometry) }
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(expectedResultsCount);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(
                actual => expected == actual.AllocationUuid) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        [DataRow(new string[] { "POINT(-96.7014 40.8146)", "POINT(-96.7014 40.7146)" }, new string[] { "POINT(-96.7010 40.8146)" }, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POLYGON((-96.7015 40.7149,-96.7012 40.7149,-96.7012 40.7146,-96.7015 40.7146,-96.7015 40.7149))", DisplayName = "2 matches 1 for each polygon")]
        [DataRow(new string[] { "POINT(-96.7014 40.7146)" }, new string[] { "POINT(-96.7010 40.8146)" }, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POLYGON((-96.7015 40.7149,-96.7012 40.7149,-96.7012 40.7146,-96.7015 40.7146,-96.7015 40.7149))", DisplayName = "site 1 match 1st polygon")]
        [DataRow(new string[] { "POINT(-96.7014 40.8146)" }, new string[] { "POINT(-96.7010 40.8146)" }, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POLYGON((-96.7015 40.7149,-96.7012 40.7149,-96.7012 40.7146,-96.7015 40.7146,-96.7015 40.7149))", DisplayName = "site 2 match 2nd polygon")]
        [DataRow(new string[] { "POINT(-96.7014 40.8146)" }, new string[] { "POINT(-96.7010 40.8146)", "POINT(-96.7014 40.7146)" }, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", null, DisplayName = "site 1 match 1 polygon")]
        [DataRow(new string[] { "POINT(-96.7014 40.7146)" }, new string[] { "POINT(-96.7010 40.8146)", "POINT(-96.7014 40.8146)" }, null, "POLYGON((-96.7015 40.7149,-96.7012 40.7149,-96.7012 40.7146,-96.7015 40.7146,-96.7015 40.7149))", DisplayName = "site 2 match 1 polygon")]
        [DataRow(new string[] { }, new string[] { "POINT(-96.7010 40.8146)" }, "POLYGON((-96.7015 40.8149,-96.7012 40.8149,-96.7012 40.8146,-96.7015 40.8146,-96.7015 40.8149))", "POLYGON((-96.7015 40.7149,-96.7012 40.7149,-96.7012 40.7146,-96.7015 40.7146,-96.7015 40.7149))", DisplayName = "0 match 2 polygons")]
        public async Task FindWaterRights_SearchByMultipleGeometries_MultipleMatches(string[] matchedSitePoints, string[] unmatchedSitePoints, string filterPolygon1, string filterPolygon2)
        {
            //Arrange
            var matchedAllocationAmounts = new List<EF.AllocationAmountsFact>();
            var nonMatchedAllocationAmounts = new List<EF.AllocationAmountsFact>();

            foreach (var point in matchedSitePoints)
            {
                var matchedSite = new SitesDimFaker()
                .RuleFor(s => s.SitePoint, () => GeometryHelpers.GetGeometryByWkt(point))
                .Generate();

                matchedAllocationAmounts.Add(new AllocationAmountFactFaker().LinkSites(matchedSite).Generate());
            }

            foreach (var point in unmatchedSitePoints)
            {
                var nonMatchedSite = new SitesDimFaker()
                        .RuleFor(s => s.SitePoint, () => GeometryHelpers.GetGeometryByWkt(point))
                        .Generate();

                nonMatchedAllocationAmounts.AddRange(new AllocationAmountFactFaker().LinkSites(nonMatchedSite).Generate(3));
            }

            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.AddRange(matchedAllocationAmounts);
                db.AllocationAmountsFact.AddRange(nonMatchedAllocationAmounts);
                db.SaveChanges();
            }

            var expectedAllocationUuids = matchedAllocationAmounts.Select(x => x.AllocationUuid).ToList();

            var filters = new List<NetTopologySuite.Geometries.Geometry>();
            if (!string.IsNullOrWhiteSpace(filterPolygon1))
            {
                filters.Add(GeometryHelpers.GetGeometryByWkt(filterPolygon1));
            }
            if (!string.IsNullOrWhiteSpace(filterPolygon2))
            {
                filters.Add(GeometryHelpers.GetGeometryByWkt(filterPolygon2));
            }

            var searchCriteria = new WaterRightsSearchCriteria
            {
                FilterGeometry = filters.ToArray()
            };

            //Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.FindWaterRights(searchCriteria, 0);

            //Assert
            result.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(matchedSitePoints.Length);

            expectedAllocationUuids.TrueForAll(expected => result.WaterRightsDetails.SingleOrDefault(
                actual => expected == actual.AllocationUuid) != null)
                .Should().BeTrue();
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetWaterAllocationAmountOrganizationById_ShouldReturnOrg()
        {
            // Arrange
            var allocationAmount = new AllocationAmountFactFaker().Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocationAmount);
                db.SaveChanges();
            }

            var expectedOrg = allocationAmount.Organization;
            var allocationAmountId = allocationAmount.AllocationAmountId;

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterAllocationAmountOrganizationById(allocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.OrganizationName.Should().Be(expectedOrg.OrganizationName);
            result.OrganizationId.Should().Be(expectedOrg.OrganizationId);
        }

        [TestMethod]
        public async Task GetWaterRightDetailsById_Matches()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var expirationDate = new Faker().Date.Past(150);
            var priorityDate = new Faker().Date.Past(100);
            var publishedDate = new Faker().Date.Past(50);
            var irrigationMethod = new IrrigationMethodCVFaker().Generate();
            db.IrrigationMethod.Add(irrigationMethod);

            var allocationAmount = new AllocationAmountFactFaker()
                .SetAllocationPriorityDate(priorityDate)
                .SetAllocationExpirationDate(expirationDate)
                .SetPublishedDate(publishedDate)
                .IncludeRandomConservationApplicationId()
                .Generate();
            allocationAmount.VariableSpecific.AggregationInterval = 5.0M;
            allocationAmount.IrrigationMethodCV = irrigationMethod.Name;

            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var expectedOrg = allocationAmount.Organization;
            var expectedVariable = allocationAmount.VariableSpecific;
            var allocationUuid = allocationAmount.AllocationUuid;

            var expectedResult = new CommonContracts.WaterRightDetails
            {
                MethodDescription = allocationAmount.Method.MethodDescription,
                MethodType = allocationAmount.Method.MethodTypeCv,
                AggregationInterval = expectedVariable.AggregationInterval,
                AggregationIntervalUnit = expectedVariable.AggregationIntervalUnitCv,
                AggregationStatistic = expectedVariable.AggregationStatisticCv,
                AmountUnitCv = expectedVariable.AmountUnitCv,
                ApplicableResourceType = allocationAmount.Method.ApplicableResourceTypeCv,
                MethodLink = allocationAmount.Method.MethodNemilink,
                OrganizationName = expectedOrg.OrganizationName,
                OrganizationWebsite = expectedOrg.OrganizationWebsite,
                ReportYearStartMonth = expectedVariable.ReportYearStartMonth,
                ReportYearTypeCv = expectedVariable.ReportYearTypeCv,
                State = expectedOrg.State,
                VariableCv = expectedVariable.VariableCv,
                VariableSpecific = expectedVariable.VariableSpecificCv,
                AllocationUuid = allocationUuid,
                AllocationFlowCfs = allocationAmount.AllocationFlow_CFS,
                AllocationLegalStatus = allocationAmount.AllocationLegalStatusCv,
                AllocationNativeId = allocationAmount.AllocationNativeId,
                AllocationOwner = allocationAmount.AllocationOwner,
                AllocationVolumeAF = allocationAmount.AllocationVolume_AF,
                BeneficialUses = allocationAmount.AllocationBridgeBeneficialUsesFact.Select(a => a.BeneficialUseCV).ToList(),
                ExpirationDate = allocationAmount.AllocationExpirationDateNavigation.Date,
                PriorityDate = allocationAmount.AllocationPriorityDateNavigation.Date,
                AllocationCropDutyAmount = allocationAmount.AllocationCropDutyAmount,
                AllocationTimeframeEnd = allocationAmount.AllocationTimeframeEnd,
                AllocationTimeframeStart = allocationAmount.AllocationTimeframeStart,
                DatePublished = allocationAmount.DataPublicationDate.Date.Date,
                IrrigationMethodCV = allocationAmount.IrrigationMethodCV,
                IrrigatedAcreage = allocationAmount.IrrigatedAcreage,
                CropTypeCV = allocationAmount.CropTypeCV,
                WaDEIrrigationMethod = irrigationMethod.WaDEName,
                OwnerClassificationCV = allocationAmount.OwnerClassificationCV,
                PrimaryBeneficialUseCategory = allocationAmount.PrimaryBeneficialUseCategory,
                WaterAllocationNativeUrl = allocationAmount.WaterAllocationNativeUrl,
                WaDEDataMappingUrl = allocationAmount.Method.WaDEDataMappingUrl,
                IsConservationApplicationEligible = allocationAmount.ConservationApplicationFundingOrganizationId.HasValue,
            };

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightDetailsById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResult, options =>
                options.Using<DateTime>(x => x.Subject.Should().BeSameDateAs(expirationDate)).When(info => info.Path.Equals("ExpirationDate"))
                       .Using<DateTime>(x => x.Subject.Should().BeSameDateAs(priorityDate)).When(info => info.Path.Equals("PriorityDate")));
        }

        [TestMethod]
        public async Task GetWaterRightDetailsById_NoMatch()
        {
            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightDetailsById("1234");

            // Assert
            result.Should().BeNull();
        }

        [DataTestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task GetWaterRightDetailsById_BeneficialUses(int beneficialUseCount)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var beneficialUses = new BeneficialUsesCVFaker().Generate(beneficialUseCount);

            var allocationAmount = new AllocationAmountFactFaker()
                .LinkBeneficialUses(beneficialUses.ToArray())
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightDetailsById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.BeneficialUses.Should().BeEquivalentTo(beneficialUses.Select(a => a.Name));
        }

        [DataTestMethod]
        [DataRow(null)]
        [DataRow("2022-03-30")]
        public async Task GetWaterRightDetailsById_ExpirationDate(string dateValue)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            DateTime? date = dateValue == null ? null : DateTime.Parse(dateValue);

            var allocationAmount = new AllocationAmountFactFaker()
                .SetAllocationExpirationDate(date)
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightDetailsById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.ExpirationDate.Should().Be(date);
        }

        [TestMethod]
        public async Task WaterAllocationAccessor_GetWaterRightSiteInfoById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteInfoById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.SiteUuid == sites[0].SiteUuid).Should().BeTrue();
        }

        [TestMethod]
        public async Task WaterAllocationAccessor_GetWaterRightSourceInfoById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var waterSources = new WaterSourceDimFaker().Generate(5);
            db.WaterSourcesDim.AddRange(waterSources);
            db.SaveChanges();


            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.AllocationBridgeSitesFact.Add(allocationSiteBridge);

                foreach (var waterSource in waterSources)
                {
                    var waterSourceBridge = new WaterSourceBridgeSiteFactFaker()
                        .WaterSourceBridgeSiteFactFakerWithIds(waterSource.WaterSourceId, site.SiteId)
                        .Generate();
                    db.WaterSourceBridgeSitesFact.Add(waterSourceBridge);
                }
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSourceInfoById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.WaterSourceUuid == waterSources[0].WaterSourceUuid).Should().BeTrue();
        }

        [DataTestMethod]
        [DataRow(null)]
        [DataRow("2022-01-22")]
        public async Task GetAllWaterAllocations_PriorityDate(string dateValue)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            DateTime? date = dateValue == null ? null : DateTime.Parse(dateValue);

            var allocationAmount = new AllocationAmountFactFaker()
                .SetAllocationPriorityDate(date)
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetAllWaterAllocations();

            // Assert
            result.Should().NotBeNull().And
                .HaveCount(1).And
                .Contain(a => a.AllocationPriorityDate == date);
        }

        [TestMethod]
        public async Task WaterAllocationAccessor_GetWaterRightSiteLocationsById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteLocationsById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.Latitude == sites[0].Latitude).Should().BeTrue();
        }

        [TestMethod]
        public async Task WaterAllocationAccessor_GetWaterRightSiteLocationsById_SkipNulls()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var nullLocationSite = new SitesDimFaker().Generate();
            nullLocationSite.Latitude = null;
            nullLocationSite.Longitude = null;
            db.SitesDim.Add(nullLocationSite);
            db.SaveChanges();

            sites.Add(nullLocationSite);

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteLocationsById(allocationAmount.AllocationUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetVariables()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            // generates 1 variable linked to allocation
            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var variables = new VariablesDimFaker().Generate(5);
            db.VariablesDim.AddRange(variables);
            db.SaveChanges();

            var variable = allocationAmount.VariableSpecific;
            var expectedResult = new Accessors.CsvModels.Variables
            {
                VariableCv = allocationAmount.VariableSpecific.VariableCv,
                VariableSpecificUuid = variable.VariableSpecificUuid,
                AggregationInterval = allocationAmount.VariableSpecific.AggregationInterval,
                VariableSpecificCv = allocationAmount.VariableSpecific.VariableSpecificCv,
                AmountUnitCv = variable.AmountUnitCv,
                AggregationIntervalUnitCv = variable.AggregationIntervalUnitCv,
                AggregationStatisticCv = variable.AggregationStatisticCv,
                MaximumAmountUnitCv = variable.MaximumAmountUnitCv,
                ReportYearStartMonth = variable.ReportYearStartMonth,
                ReportYearTypeCv = variable.ReportYearTypeCv,
            };
            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetVariables(searCriteria);

            result.Should().NotBeNull();
            result.Count().Should().Be(1);

            result.First().Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetOrganizations()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            // generates 1 organization linked to allocation
            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var organizations = new OrganizationsDimFaker().Generate(5);
            db.OrganizationsDim.AddRange(organizations);
            db.SaveChanges();

            var organization = allocationAmount.Organization;
            var expectedResult = new Accessors.CsvModels.Organizations
            {
                OrganizationContactEmail = organization.OrganizationContactEmail,
                OrganizationContactName = organization.OrganizationContactName,
                OrganizationName = organization.OrganizationName,
                OrganizationPhoneNumber = organization.OrganizationPhoneNumber,
                OrganizationPurview = organization.OrganizationPurview,
                OrganizationUuid = organization.OrganizationUuid,
                OrganizationWebsite = organization.OrganizationWebsite,
                State = organization.State,
            };
            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetOrganizations(searCriteria);

            result.Should().NotBeNull();
            result.Count().Should().Be(1);

            result.First().Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetMethods()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            // generates 1 method linked to allocation
            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var methods = new MethodsDimFaker().Generate(5);
            db.MethodsDim.AddRange(methods);
            db.SaveChanges();

            var method = allocationAmount.Method;
            var expectedResult = new Accessors.CsvModels.Methods
            {
                ApplicableResourceTypeCv = method.ApplicableResourceTypeCv,
                DataConfidenceValue = method.DataConfidenceValue,
                DataCoverageValue = method.DataCoverageValue,
                DataQualityValueCv = method.DataQualityValueCv,
                MethodDescription = method.MethodDescription,
                MethodName = method.MethodName,
                MethodNemiLink = method.MethodNemilink,
                MethodTypeCv = method.MethodTypeCv,
                MethodUuid = method.MethodUuid,
                WaDEDataMappingUrl = method.WaDEDataMappingUrl
            };
            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetMethods(searCriteria);

            result.Should().NotBeNull();
            result.Count().Should().Be(1);

            result.First().Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetWaterSources()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var waterSources = new WaterSourceDimFaker().Generate();

            var site = new SitesDimFaker().LinkWaterSources(waterSources).Generate();
            var allocation = new AllocationAmountFactFaker().LinkSites(site).Generate();
            db.AllocationAmountsFact.Add(allocation);
            db.SaveChanges();

            var waterSource = site.WaterSourceBridgeSitesFact.First().WaterSource;
            var test = waterSource.Geometry;

            var expectedResult = new Accessors.CsvModels.WaterSources
            {
                Geometry = string.Empty,
                GnisFeatureNameCv = waterSource.GnisfeatureNameCv,
                WaterQualityIndicatorCv = waterSource.WaterQualityIndicatorCv,
                WaterSourceName = waterSource.WaterSourceName,
                WaterSourceNativeId = waterSource.WaterSourceNativeId,
                WaterSourceTypeCv = waterSource.WaterSourceTypeCv,
                WaterSourceUuid = waterSource.WaterSourceUuid,
            };
            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterSources(searCriteria);

            result.Should().NotBeNull();
            result.Count().Should().Be(1);

            result.First().Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetWaterRightsCount()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var allocationAmount = new AllocationAmountFactFaker()
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterRightsCount(searCriteria);

            result.Should().Be(1);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetWaterRightsCount_Multiple()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var allocationAmount = new AllocationAmountFactFaker()
                .Generate(100);
            db.AllocationAmountsFact.AddRange(allocationAmount);
            db.SaveChanges();

            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                States = new string[] { }
            };

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterRightsCount(searCriteria);

            result.Should().Be(100);
        }

        [TestMethod]
        public void WaterAllocationAccessor_GetWaterRightsCount_FilterByExemptUse()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var allocationAmount = new AllocationAmountFactFaker()
                .Generate(100);

            for (var i = 0; i < allocationAmount.Count; i++)
            {
                if (i % 2 == 0)
                {
                    allocationAmount[i].ExemptOfVolumeFlowPriority = true;
                }
            }

            db.AllocationAmountsFact.AddRange(allocationAmount);
            db.SaveChanges();

            // Act
            var searCriteria = new WaterRightsSearchCriteria
            {
                ExemptOfVolumeFlowPriority = true
            };

            // total db count
            allocationAmount.Count.Should().Be(100);

            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterRightsCount(searCriteria);

            result.Should().Be(50);
        }

        [DataTestMethod]
        [DataRow(false, false, false, DisplayName = "Water right does not exist")]
        [DataRow(true, false, false, DisplayName = "Water right does not have funding org")]
        [DataRow(true, true, true, DisplayName = "Water right has funding org")]
        public async Task WaterAllocationAccessor_GetWaterRightFundingOrgDetailsByNativeId_Success(
            bool waterRightExists,
            bool waterRightHasFundingOrg,
            bool shouldSucceed
        )
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            string nativeId = string.Empty;

            if (waterRightExists)
            {
                var waterRightFaker = new AllocationAmountFactFaker();

                if (waterRightHasFundingOrg)
                {
                    waterRightFaker.RuleFor(aaf => aaf.ConservationApplicationFundingOrganizationId, () => Guid.NewGuid());
                }

                var waterRight = waterRightFaker.Generate();
                db.AllocationAmountsFact.Add(waterRight);
                db.SaveChanges();

                nativeId = waterRight.AllocationUuid;
            }

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var call = async () => await accessor.GetWaterRightFundingOrgDetailsByUuid(nativeId);

            // Assert
            if (shouldSucceed)
            {
                var response = await call();
                response.Should().NotBeNull();
                response.FundingOrganizationId.Should().NotBeEmpty();
            }
            else
            {
                await call.Should().ThrowAsync<WestDaatException>();
            }
        }

        private WaterAllocationAccessor CreateWaterAllocationAccessor()
        {
            return new WaterAllocationAccessor(CreateLogger<WaterAllocationAccessor>(), CreateDatabaseContextFactory(), CreatePerformanceConfiguration());
        }
    }
}
