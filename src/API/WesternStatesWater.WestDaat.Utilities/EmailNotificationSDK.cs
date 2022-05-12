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
        private readonly SendGridClient _client;
        private readonly ILogger _logger;

        public EmailNotificationSdk(EmailServiceConfiguration emailConfig, ILogger<EmailNotificationSdk> logger)
        {
            _client = new SendGridClient(emailConfig.APIKey);
            _logger = logger;
        }

        public async Task SendEmail(CommonDTO.EmailRequest message)
        {
            var msg = new SendGridMessage
            {
                Subject = message.Subject,
                PlainTextContent = message.TextContent,
                HtmlContent = message.Body,
                From = new EmailAddress(message.From),
            };

            foreach (var address in message.To)
            {
                msg.AddTo(address);
            }

            var response = await _client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                throw new WestDaatException($"Something went wrong while sending email.\nStatusCode: {response.StatusCode}.\nSubject: {message.Subject}");
            }
        }
    }
}
