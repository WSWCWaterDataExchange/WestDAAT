namespace WesternStatesWater.WestDaat.Common
{
    public class CsvListModel
    {
        public IQueryable Data { get; set; }
        public string[] ColumnNames { get; set; }
        public string FileName { get; set; }
    }
}
