namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class FeedbackRequest
    {
        public string Comments { get; set; }
        public string[] DataInterest { get; set; }
        public string[] DataUsage { get; set; }
        public string Email { get; set; }
        public string Organization { get; set; }
        public string Role { get; set; }
        public string SatisfactionLevel { get; set; }
    }
}
