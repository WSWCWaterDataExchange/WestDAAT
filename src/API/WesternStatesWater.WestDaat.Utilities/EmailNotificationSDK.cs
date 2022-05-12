using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using WesternStatesWater.WestDaat.Common.Configuration;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class EmailNotificationSDK : IEmailNotificationSDK
    {
        private readonly SendGridClient _client;
        private readonly ILogger _logger;

        public EmailNotificationSDK(EmailServiceConfiguration emailService, ILogger<EmailNotificationSDK> logger)
        {
            _client = new SendGridClient(emailService.APIKey);
            _logger = logger;
        }

        public async Task<bool> SendEmail(CommonDTO.EmailRequest message)
        {
            var msg = new SendGridMessage
            {
                Subject = message.Subject,
                PlainTextContent = message.TextContent,
                From = new EmailAddress(message.From),
                HtmlContent = message.Body
            };

            foreach (var address in message.To)
            {
                msg.AddTo(address);
            }

            var response = await _client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Something went wrong while sending feedback email.\nStatusCode: {response.StatusCode}.\nMessageBody: {message.Body}.");
            }

            return response.IsSuccessStatusCode;
        }
    }
}
