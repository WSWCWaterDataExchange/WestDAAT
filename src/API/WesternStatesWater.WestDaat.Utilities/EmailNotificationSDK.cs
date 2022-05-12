using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Exceptions;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class EmailNotificationSDK : IEmailNotificationSDK
    {
        private readonly EmailServiceConfiguration _emailConfig;
        private readonly ILogger _logger;

        public EmailNotificationSDK(EmailServiceConfiguration emailService, ILogger<EmailNotificationSDK> logger)
        {
            _emailConfig = emailService;
            _logger = logger;
        }

        public async void SendFeedback(CommonDTO.EmailRequest message)
        {
            try
            {
                var msg = new SendGridMessage
                {
                    Subject = message.Subject,
                    PlainTextContent = message.TextContent,
                    From = new EmailAddress(_emailConfig.FeedbackFrom),
                };

                foreach (var address in _emailConfig.FeedbackTo)
                {
                    msg.AddTo(address);
                }

                await SendEmail(msg);
            }
            catch (WestDaatException ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        private async Task SendEmail(SendGridMessage message)
        {
            try
            {
                var client = new SendGridClient(_emailConfig.APIKey);

                var response = await client.SendEmailAsync(message);

                if (!response.IsSuccessStatusCode)
                {
                    throw new WestDaatException($"Something went wrong while sending email.\nStatusCode: {response.StatusCode}.\nSubject: {message.Subject}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
    }
}
