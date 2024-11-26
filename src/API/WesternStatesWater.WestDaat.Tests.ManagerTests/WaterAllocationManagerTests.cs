using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;
using CsvModels = WesternStatesWater.WestDaat.Accessors.CsvModels;
using NetTopologySuite.Geometries;
using WesternStatesWater.WestDaat.Utilities;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.Constants.RiverBasins;
using System.IO;
using System.IO.Compression;
using System.Globalization;
using WesternStatesWater.WestDaat.Tests.Helpers.Geometry;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class WaterAllocationManagerTests : ManagerTestBase
    {
        private readonly Mock<INldiAccessor> _nldiAccessorMock = new(MockBehavior.Strict);
        private readonly Mock<IGeoConnexEngine> _geoConnexEngineMock = new Mock<IGeoConnexEngine>(MockBehavior.Strict);
        private readonly Mock<ILocationEngine> _locationEngineMock = new Mock<ILocationEngine>(MockBehavior.Strict);
        private readonly Mock<ISiteAccessor> _siteAccessorMock = new Mock<ISiteAccessor>(MockBehavior.Strict);
        private readonly Mock<IWaterAllocationAccessor> _waterAllocationAccessorMock = new Mock<IWaterAllocationAccessor>(MockBehavior.Strict);
        private readonly Mock<ITemplateResourceSdk> _templateResourceSdk = new Mock<ITemplateResourceSdk>(MockBehavior.Strict);

        private readonly string _citationFile = Resources.Resources.citation;

        [TestMethod]
        public async Task GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_ShouldCallEngine()
        {
            // ARRANGE 
            _geoConnexEngineMock.Setup(x => x.BuildGeoConnexJson(It.IsAny<CommonContracts.Site>(), It.IsAny<CommonContracts.Organization>())).Returns("{Foo: \"bar\"}");
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).ReturnsAsync(new CommonContracts.Site
            {
                AllocationIds = new List<long> { 1, 2, 3 }
            });
            _waterAllocationAccessorMock.Setup(x => x.GetWaterAllocationAmountOrganizationById(It.IsAny<long>())).Returns(new CommonContracts.Organization());

            var manager = CreateWaterAllocationManager();

            // ACT 
            var response = await manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");

            // ASSERT 
            response.Should().NotBeNull();
            _geoConnexEngineMock.Verify(t =>
                t.BuildGeoConnexJson(It.IsAny<CommonContracts.Site>(), It.IsAny<CommonContracts.Organization>()),
                Times.Once()
            );
        }

        [TestMethod]
        public async Task GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_MissingAllocations()
        {
            // ARRANGE 
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).ReturnsAsync(new CommonContracts.Site
            {
                AllocationIds = new List<long> { /* Empty */ }
            });

            var manager = CreateWaterAllocationManager();

            // ACT 
            Func<Task> call = async () => await manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");
            await call.Should().ThrowAsync<WestDaatException>();
        }

        [TestMethod]
        public async Task GetNldiFeatures_Success()
        {
            var faker = new Faker();
            var latitude = faker.Random.Double();
            var longitude = faker.Random.Double();
            var directions = faker.Random.Enum<Common.NldiDirections>();
            var dataPoints = faker.Random.Enum<Common.NldiDataPoints>();

            var resultFeatureCollection = new FeatureCollection();

            _nldiAccessorMock.Setup(a => a.GetNldiFeatures(latitude, longitude, directions, dataPoints))
                             .ReturnsAsync(resultFeatureCollection)
                             .Verifiable();

            var sut = CreateWaterAllocationManager();
            var result = await sut.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            result.Should().Be(resultFeatureCollection);
            _nldiAccessorMock.VerifyAll();
        }

        [TestMethod]
        public async Task GetAnalyticsSummaryInformation_ResultsReturned()
        {
            var slice = new CommonContracts.AnalyticsSummaryInformation()
            {
                Flow = 0,
                PrimaryUseCategoryName = "",
                Points = 0,
                Volume = 0
            };
            //Arrange
            _waterAllocationAccessorMock.Setup(x => x.GetAnalyticsSummaryInformation(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .ReturnsAsync(new CommonContracts.AnalyticsSummaryInformation[]
                {
                    slice, slice, slice
                })
                .Verifiable();

            var searchCriteria = new WaterRightsSearchCriteria();

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.GetAnalyticsSummaryInformation(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        [DataRow(true)]
        [DataRow(false)]
        public async Task GetWaterRightsEnvelope_ResultsReturned(bool hasResults)
        {
            //Arrange
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsEnvelope(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .ReturnsAsync(hasResults ? new PolygonFaker().Generate() : null)
                .Verifiable();

            var searchCriteria = new WaterRightsSearchCriteria();

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightsEnvelope(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            result.Features.Should().HaveCount(hasResults ? 1 : 0);
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task FindWaterRights_ResultsReturned()
        {
            //Arrange
            _waterAllocationAccessorMock.Setup(x => x.FindWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>(), It.IsAny<int>()))
                .ReturnsAsync(new CommonContracts.WaterRightsSearchResults
                {
                    CurrentPageNumber = 0,
                    WaterRightsDetails = new CommonContracts.WaterRightsSearchDetail[]
                    {
                        new CommonContracts.WaterRightsSearchDetail
                        {
                            AllocationUuid = "abc123"
                        }
                    }
                })
                .Verifiable();

            var searchCriteria = new WaterRightsSearchCriteriaWithPaging
            {
                PageNumber = 0,
            };

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.FindWaterRights(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByGeometry_GeoJsonConvertedToGeometry()
        {
            //Arrange
            Geometry[] actualFilterGeometryParam = null;

            _waterAllocationAccessorMock.Setup(x => x.FindWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>(), It.IsAny<int>()))
                .Callback((CommonContracts.WaterRightsSearchCriteria x, int pageNumber) => actualFilterGeometryParam = x.FilterGeometry)
                .ReturnsAsync(new CommonContracts.WaterRightsSearchResults
                {
                    CurrentPageNumber = 0,
                    WaterRightsDetails = new CommonContracts.WaterRightsSearchDetail[]
                    {
                        new CommonContracts.WaterRightsSearchDetail
                        {
                            AllocationUuid = "abc123"
                        }
                    }
                })
                .Verifiable();

            var searchCriteria = new WaterRightsSearchCriteriaWithPaging
            {
                PageNumber = 0,
                FilterGeometry = new string[]
                {
                    "{\"type\":\"Point\",\"coordinates\":[-96.7014,40.8146]}",
                    "{\"coordinates\":[[[-99.88974043488068,42.5970189859552],[-99.89330729367737,42.553083043677304],[-99.78662578967582,42.547588874524024],[-99.78143763142621,42.59487066530488],[-99.88974043488068,42.5970189859552]]],\"type\":\"Polygon\"}"
                }
            };

            var expectedFilterGeometryParam = searchCriteria.FilterGeometry.Select(x => GeometryHelpers.GetGeometryByGeoJson(x));
            expectedFilterGeometryParam.Should().NotBeNullOrEmpty();
            expectedFilterGeometryParam.Should().HaveCount(2);
            expectedFilterGeometryParam.All(x => x != null).Should().BeTrue();

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.FindWaterRights(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(1);
            result.WaterRightsDetails[0].AllocationUuid.Should().Be("abc123");
            actualFilterGeometryParam.Should().NotBeNull();
            actualFilterGeometryParam.Should().BeEquivalentTo(expectedFilterGeometryParam);
        }

        [TestMethod]
        public async Task FindWaterRights_SearchByRiverBasinNames_FeatureConvertedToGeometry()
        {
            //Arrange
            Geometry[] actualFilterGeometryParam = null;

            _waterAllocationAccessorMock.Setup(x => x.FindWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>(), It.IsAny<int>()))
                .Callback((CommonContracts.WaterRightsSearchCriteria x, int pageNumber) => actualFilterGeometryParam = x.FilterGeometry)
                .ReturnsAsync(new CommonContracts.WaterRightsSearchResults
                {
                    CurrentPageNumber = 0,
                    WaterRightsDetails = new CommonContracts.WaterRightsSearchDetail[]
                    {
                        new CommonContracts.WaterRightsSearchDetail
                        {
                            AllocationUuid = "abc123"
                        }
                    }
                })
                .Verifiable();

            _locationEngineMock.Setup(x => x.GetRiverBasinPolygonsByName(It.Is<string[]>(s => s.Length == 1 && s[0] == ColoradoRiverBasin.BasinName)))
                .Returns(new FeatureCollection(new List<Feature> { ColoradoRiverBasin.Feature }))
                .Verifiable();

            var expectedFilterGeometryParam = GeometryHelpers.GetGeometryByFeatures(new List<Feature> { ColoradoRiverBasin.Feature });

            var searchCriteria = new WaterRightsSearchCriteriaWithPaging
            {
                PageNumber = 0,
                RiverBasinNames = new[] { ColoradoRiverBasin.BasinName }
            };

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.FindWaterRights(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            result.WaterRightsDetails.Should().HaveCount(1);
            _locationEngineMock.Verify();
            result.WaterRightsDetails[0].AllocationUuid.Should().Be("abc123");
            actualFilterGeometryParam.Should().NotBeNull();
            actualFilterGeometryParam.Should().BeEquivalentTo(expectedFilterGeometryParam);
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetSiteDetails()
        {
            _siteAccessorMock.Setup(x => x.GetSiteDetailsByUuid("TESTME")).ReturnsAsync(new CommonContracts.SiteDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetSiteDetails("TESTME");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterSiteLocation()
        {
            var location = new CommonContracts.SiteLocation
            {
                Latitude = 999,
                Longitude = 888,
                PODorPOUSite = "TEST_PODorPOU",
                SiteUuid = "TEST_PODorPOU"
            };

            _siteAccessorMock.Setup(x => x.GetWaterSiteLocationByUuid("TEST_PODorPOU")).ReturnsAsync(location).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterSiteLocation("TEST_PODorPOU");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();

            result.Properties.First(x => x.Key.ToLower() == "uuid").Value.Should().Be(location.SiteUuid);
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightDetails()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightDetailsById("99")).ReturnsAsync(new CommonContracts.WaterRightDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightDetails("99");

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightDetails_Null()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightDetailsById("99")).ReturnsAsync((CommonContracts.WaterRightDetails)null).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightDetails("99");

            result.Should().BeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSiteInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSiteInfoById("99")).ReturnsAsync(new List<CommonContracts.SiteInfoListItem> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSiteInfoList("99");

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSourceInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSourceInfoById("99")).ReturnsAsync(new List<CommonContracts.WaterSourceInfoListItem> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSourceInfoList("99");

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightsDigestsBySite()
        {
            var siteUuid = new Faker().Random.String(11, 'A', 'z');
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsDigestsBySite(siteUuid)).ReturnsAsync(new List<CommonContracts.WaterRightsDigest> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightsDigestsBySite(siteUuid);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSiteLocations()
        {
            var location = new CommonContracts.SiteLocation
            {
                Latitude = 999,
                Longitude = 888,
                PODorPOUSite = "TEST_PODorPOU",
                SiteUuid = "TEST_PODorPOU"
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSiteLocationsById("99")).ReturnsAsync(new List<CommonContracts.SiteLocation> { location }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSiteLocations("99");

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();

            result.Features.Count.Should().Be(1);
            result.Features[0].Properties.First(x => x.Key.ToLower() == "uuid").Value.Should().Be(location.SiteUuid);
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterSiteSourceInfoList()
        {
            _siteAccessorMock.Setup(x => x.GetWaterSiteSourceInfoListByUuid("siteuuid")).ReturnsAsync(new List<CommonContracts.WaterSourceInfoListItem> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterSiteSourceInfoListByUuid("siteuuid");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public void ConvertRiverBasinFeaturesToGeometries_Success()
        {
            var basinNames = new List<string>
            {
                ArkansasRiverBasin.BasinName,
                ColoradoRiverBasin.BasinName
            };

            var features = RiverBasinConstants.RiverBasinDictionary.Where(x => basinNames.Contains(x.Key)).Select(x => x.Value).ToList();

            var polygons = GeometryHelpers.GetGeometryByFeatures(features);

            polygons.Should().NotBeNull();
            polygons.Should().HaveCount(2);
        }

        [TestMethod]
        [DataRow(100001)]
        [DataRow(450000)]
        public async Task WaterRightsAsZip_ThrowsException_CountMoreThanPerformanceMaxDownload(int returnAmount)
        {
            var managerSearchRequest = new WaterRightsSearchCriteriaWithFilterUrl
            {
                States = new string[] { "NE" }
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(returnAmount)
                .Verifiable();

            var manager = CreateWaterAllocationManager();
            await Assert.ThrowsExceptionAsync<WestDaatException>(async () => await manager.WaterRightsAsZip(new MemoryStream(), managerSearchRequest));

            _waterAllocationAccessorMock.Verify(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()), Times.Once);
        }

        [TestMethod]
        public async Task WaterRightsAsZip_ThrowsException_WhenAllSearchCriteriaPropertiesAreNull()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Verifiable();

            var manager = CreateWaterAllocationManager();
            await Assert.ThrowsExceptionAsync<NullReferenceException>(async () => await manager.WaterRightsAsZip(new MemoryStream(), It.IsAny<WaterRightsSearchCriteriaWithFilterUrl>()));

            // throws exception when building the predicate, before this call
            _waterAllocationAccessorMock.Verify(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()), Times.Never);
        }
        
        [TestMethod]
        public async Task WaterRightsAsZip_BuildsStream_Variables()
        {
            var variables = new List<CsvModels.Variables>
            {
                new CsvModels.Variables { VariableSpecificUuid = Guid.NewGuid().ToString() },
                new CsvModels.Variables { VariableSpecificUuid = Guid.NewGuid().ToString() },
                new CsvModels.Variables { VariableSpecificUuid = Guid.NewGuid().ToString() }
            };

            var iEnumerableList = new List<(string, IEnumerable<dynamic>)>
            {
                ("Variables", variables)
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(5)
                .Verifiable();

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(iEnumerableList)
                .Verifiable();

            _templateResourceSdk.Setup(s => s.GetTemplate(Common.ResourceType.Citation))
                .Returns(_citationFile);

            var managerSearchRequest = new WaterRightsSearchCriteriaWithFilterUrl
            {
                States = new string[] { "NE" }
            };

            var memoryStream = new MemoryStream();

            var manager = CreateWaterAllocationManager();
            await manager.WaterRightsAsZip(memoryStream, managerSearchRequest);

            memoryStream.Seek(0, SeekOrigin.Begin);

            using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Read))
            {
                zipArchive.Entries.Count.Should().Be(2);
                foreach (var entry in zipArchive.Entries)
                {
                    using (var entryStream = entry.Open())
                    {
                        await CheckRecords(entryStream, entry.FullName, variables);
                    }
                }
            }

            _waterAllocationAccessorMock.Verify(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()), Times.Once);
            _waterAllocationAccessorMock.Verify(x => x.GetWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()), Times.Once);
        }

        [TestMethod]
        public async Task WaterRightsAsZip_BuildsStream_Organizations()
        {
            var organizations = new List<CsvModels.Organizations>
            {
                new CsvModels.Organizations
                {
                    OrganizationUuid = Guid.NewGuid().ToString()
                },
                new CsvModels.Organizations
                {
                    OrganizationUuid = Guid.NewGuid().ToString()
                },
                new CsvModels.Organizations
                {
                    OrganizationUuid = Guid.NewGuid().ToString()
                }
            };

            var iEnumerableList = new List<(string, IEnumerable<dynamic>)>
            {
                ("Organizations", organizations)
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(5)
                .Verifiable();

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(iEnumerableList)
                .Verifiable();

            _templateResourceSdk.Setup(s => s.GetTemplate(Common.ResourceType.Citation))
                .Returns(_citationFile);

            var managerSearchRequest = new WaterRightsSearchCriteriaWithFilterUrl
            {
                States = new string[] { "NE" }
            };

            var memoryStream = new MemoryStream();

            var manager = CreateWaterAllocationManager();
            await manager.WaterRightsAsZip(memoryStream, managerSearchRequest);

            memoryStream.Seek(0, SeekOrigin.Begin);

            using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Read))
            {
                zipArchive.Entries.Count.Should().Be(2);

                foreach (var entry in zipArchive.Entries)
                {
                    using (var entryStream = entry.Open())
                    {
                        await CheckRecords(entryStream, entry.FullName, organizations);
                    }
                }
            }
        }

        [TestMethod]
        public async Task WaterRightsAsZip_BuildsStream_AllCollectionsWithData()
        {
            var organizations = new List<CsvModels.Organizations>
            {
                new CsvModels.Organizations
                {
                    OrganizationUuid = Guid.NewGuid().ToString()
                }
            };

            var methods = new List<CsvModels.Methods>
            {
                new CsvModels.Methods
                {
                    MethodUuid = Guid.NewGuid().ToString()
                }
            };

            var variables = new List<CsvModels.Variables>
            {
                new CsvModels.Variables
                {
                    VariableSpecificUuid = Guid.NewGuid().ToString()
                }
            };

            var podtopu = new List<CsvModels.PodSiteToPouSiteRelationships>
            {
                new CsvModels.PodSiteToPouSiteRelationships
                {
                    PODSiteUuid = Guid.NewGuid().ToString()
                }
            };

            var sites = new List<CsvModels.Sites>
            {
                new CsvModels.Sites
                {
                    SiteUuid = Guid.NewGuid().ToString()
                }
            };

            var watersources = new List<CsvModels.WaterSources>
            {
                new CsvModels.WaterSources
                {
                    WaterSourceUuid = Guid.NewGuid().ToString()
                }
            };

            var allocations = new List<CsvModels.WaterAllocations>
            {
                new CsvModels.WaterAllocations
                {
                    WaterAllocationNativeUrl = Guid.NewGuid().ToString()
                }
            };

            var iEnumerableList = new List<(string, IEnumerable<dynamic>)>
            {
                ("Organizations", organizations),
                ("Methods", methods),
                ("Variables", variables),
                ("PodSiteToPouSiteRelationships", podtopu),
                ("Sites", sites),
                ("WaterSources", watersources),
                ("WaterAllocations", allocations)
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsCount(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(5)
                .Verifiable();

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .Returns(iEnumerableList)
                .Verifiable();

            _templateResourceSdk.Setup(s => s.GetTemplate(Common.ResourceType.Citation))
                .Returns(_citationFile);

            var managerSearchRequest = new WaterRightsSearchCriteriaWithFilterUrl
            {
                States = new string[] { "NE" }
            };

            var memoryStream = new MemoryStream();

            var manager = CreateWaterAllocationManager();
            await manager.WaterRightsAsZip(memoryStream, managerSearchRequest);

            memoryStream.Seek(0, SeekOrigin.Begin);

            using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Read))
            {
                zipArchive.Entries.Count.Should().Be(8);

                foreach (var entry in zipArchive.Entries)
                {
                    if (entry.FullName != "citation.txt")
                    {
                        using (var entryStream = entry.Open())
                        {
                            switch (entry.FullName)
                            {
                                case "Organizations.csv":
                                    await CheckRecords(entryStream, entry.FullName, organizations);
                                    break;
                                case "Methods.csv":
                                    await CheckRecords(entryStream, entry.FullName, methods);
                                    break;
                                case "Variables.csv":
                                    await CheckRecords(entryStream, entry.FullName, variables);
                                    break;
                                case "PodSiteToPouSiteRelationships.csv":
                                    await CheckRecords(entryStream, entry.FullName, podtopu);
                                    break;
                                case "Sites.csv":
                                    await CheckRecords(entryStream, entry.FullName, sites);
                                    break;
                                case "WaterSources.csv":
                                    await CheckRecords(entryStream, entry.FullName, watersources);
                                    break;
                                case "WaterAllocations.csv":
                                    await CheckRecords(entryStream, entry.FullName, allocations);
                                    break;
                            }
                        }
                    }
                }
            }
        }

        private async Task CheckRecords<T>(Stream entryStream, string fileEnd, List<T> list)
        {
            using var data = new MemoryStream();
            await entryStream.CopyToAsync(data);
            data.Position = 0;

            using var reader = new StreamReader(data);
            data.Seek(0, SeekOrigin.Begin);

            if (fileEnd.EndsWith(".csv"))
            {
                using var csvReader = new CsvHelper.CsvReader(reader, CultureInfo.InvariantCulture);
                csvReader.Context.TypeConverterOptionsCache.GetOptions<string>().NullValues.Add("");
                var records = csvReader.GetRecords<T>().ToList();

                records.Count.Should().Be(list.Count());
                records.Should().BeEquivalentTo(list);
            }
            else if (fileEnd.EndsWith(".txt"))
            {
                var content = await reader.ReadToEndAsync();
                content.Should().Contain(DateTime.Now.ToString("d"));
            }
        }

        private IWaterAllocationManager CreateWaterAllocationManager()
        {
            return new WaterAllocationManager(
                _nldiAccessorMock.Object,
                _siteAccessorMock.Object,
                _waterAllocationAccessorMock.Object,
                _geoConnexEngineMock.Object,
                _locationEngineMock.Object,
                _templateResourceSdk.Object,
                CreatePerformanceConfiguration(),
                CreateLogger<WaterAllocationManager>()
            );
        }
    }
}
