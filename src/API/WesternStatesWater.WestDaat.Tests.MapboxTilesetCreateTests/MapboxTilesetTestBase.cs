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

    private static Dictionary<string, string> DefaultTestConfiguration => new()
    {
        {
            $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.WadeConnectionString)}",
            "Server=localhost;Initial Catalog=WaDE2Test;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;"
        }
    };
    
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
            .AddInMemoryCollection(DefaultTestConfiguration!)
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
    public string uuid { get; set; } = "";
    public string o { get; set; } = "";
    public string[] oClass { get; set; } = [];
    public string[] bu { get; set; } = [];
    public string podPou { get; set; } = "";
    public string[] wsType { get; set; } = [];
    public string[] st { get; set; } = [];
    public string[] ls { get; set; } = [];
    public string[] sType { get; set; } = [];
    public string[] allocType { get; set; } = [];
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
    public string uuid { get; set; } = "";
    public string[] oType { get; set; } = [];
}

public class TimeSeriesFeatureProperties
{
    public string uuid { get; set; } = "";
    public string state { get; set; } = "";
    public string siteType { get; set; } = "";
    public long startDate { get; set; }
    public long endDate { get; set; }
    public string[] primaryUseCategory { get; set; } = [];
    public string[] variableType { get; set; } = [];
    public string[] waterSourceType { get; set; } = [];
}

