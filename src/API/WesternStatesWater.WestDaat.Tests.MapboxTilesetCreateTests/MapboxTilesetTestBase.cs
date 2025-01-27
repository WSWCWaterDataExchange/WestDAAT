using System.Transactions;
using Microsoft.Extensions.Configuration;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

public class MapboxTilesetTestBase
{
    private TransactionScope _transactionScopeFixture = null!;
    protected DatabaseContext Db = null!;
    protected string GeoJsonDir = null!; 
    
    [TestInitialize]
    public void TestInitialize()
    {
        if (Directory.Exists("geojson"))
        {
            Directory.Delete("geojson", true);
        }

        GeoJsonDir = Directory.CreateDirectory("geojson").FullName;

        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
            Timeout = TransactionManager.MaximumTimeout
        };
        _transactionScopeFixture = new TransactionScope(
            TransactionScopeOption.Required,
            transactionOptions,
            TransactionScopeAsyncFlowOption.Enabled);

        var config = new ConfigurationBuilder()
            .SetBasePath(Environment.CurrentDirectory)
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
            .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        var dbConfig = config.GetDatabaseConfiguration();
        IDatabaseContextFactory dbFactory = new DatabaseContextFactory(dbConfig);
        Db = dbFactory.Create();
    }

    [TestCleanup]
    public void BaseTestCleanup()
    {
        _transactionScopeFixture.Dispose();
    }
}

public class Maptiler<T>
{
    public string type { get; set; } = null!;
    public required T properties { get; set; }
}

public class AllocationFeatureProperties
{
    public string uuid { get; set; } = null!;
    public string o { get; set; } = null!;
    public string[] oClass { get; set; } = null!;
    public string[] bu { get; set; }
    public string podPou { get; set; }
    public string[] wsType { get; set; }
    public string[] st { get; set; }
    public string[] ls { get; set; }
    public string[] sType { get; set; }
    public string[] allocType { get; set; }
    public bool xmpt { get; set; }
    public double? minFlow { get; set; }
    public double? maxFlow { get; set; }
    public double? minVol { get; set; }
    public double? maxVol { get; set; }
    public long? minPri { get; set; }
    public long? maxPri { get; set; }
}

public class OverlayFeatureProperties
{
    public string uuid { get; set; } = null!;
    public string[] oType { get; set; } = null!;
}