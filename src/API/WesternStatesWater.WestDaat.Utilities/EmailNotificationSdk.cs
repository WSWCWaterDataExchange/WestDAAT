using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Exceptions;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class EmailNotificationSdk : IEmailNotificationSdk
    {
        private readonly EmailServiceConfiguration _emailConfiguration;
        private readonly ILogger _logger;

        public EmailNotificationSdk(EmailServiceConfiguration emailConfig, ILogger<EmailNotificationSdk> logger)
        {
            _emailConfiguration = emailConfig;
            _logger = logger;
        }

        public async Task SendEmail(CommonDTO.EmailRequest message)
        {
            var msg = new SendGridMessage
            {
                Subject = message.Subject,
                PlainTextContent = message.TextContent,
                HtmlContent = message.Body,
                From = new EmailAddress(message.From, message.FromName ?? message.From),
            };

            if (!string.IsNullOrWhiteSpace(message.ReplyTo))
            {
                msg.ReplyTo = new EmailAddress(message.ReplyTo);
            }

            foreach (var toAddress in message.To)
            {
                msg.AddTo(toAddress);
            }

            var client = new SendGridClient(_emailConfiguration.APIKey);
            var response = await client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                throw new WestDaatException(
                    $"Something went wrong while sending email.\n " +
                    $"Response StatusCode: {response.StatusCode}.\n " +
                    $"Response Body: {await response.Body.ReadAsStringAsync()}.\n " +
                    $"Subject: {message.Subject}");
            }
        }
    }
}