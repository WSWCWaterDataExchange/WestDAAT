namespace WesternStatesWater.WestDaat.Common.Configuration
{
    public class EmailServiceConfiguration
    {
        public string APIKey { get; set; }

        public string[] FeedbackTo { get; set; }

        public string FeedbackFrom { get; set; }

        public string NotificationFrom { get; set; }

        public string NotificationFromName { get; set; }
    }
}