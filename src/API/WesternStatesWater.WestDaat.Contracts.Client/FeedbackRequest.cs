namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class FeedbackRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Comments { get; set; }
        public string[] DataUsage { get; set; }
        public string Email { get; set; }
        public string Organization { get; set; }
        public string Role { get; set; }
        public string SatisfactionLevel { get; set; }
        public string Url { get; set; }
    }
}
