namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class ImportErrors
    {
        public long Id { get; set; }
        public string Type { get; set; }
        public string RunId { get; set; }
        public string Data { get; set; }
    }
}
