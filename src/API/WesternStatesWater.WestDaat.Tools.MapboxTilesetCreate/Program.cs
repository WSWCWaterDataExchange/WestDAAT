namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate
{
    public static class Program
    {
        static async Task Main(string[] args)
        {
            await MapboxTileset.CreateTilesetFiles();
        }
    }
}