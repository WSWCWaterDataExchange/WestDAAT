namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class EmailRequest
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string TextContent { get; set; }
        public string From { get; set; }
        public string To { get; set; }
    }
}
