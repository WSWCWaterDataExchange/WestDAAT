namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class EmailRequest
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string TextContent { get; set; }
        public string From { get; set; }

        /// <summary>
        /// Name of sender. If not provided, From will be used.
        /// </summary>
        public string FromName { get; set; }

        public string ReplyTo { get; set; }

        /// <summary>
        /// Will be used to send email to multiple recipients.
        /// Note - each recipient will be visible to all other recipients.
        /// </summary>
        public string[] To { get; set; }
    }
}