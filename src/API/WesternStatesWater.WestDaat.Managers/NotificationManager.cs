using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.RegularExpressions;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Utilities;
using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class NotificationManager : ManagerBase, INotificationManager
    {
        private readonly IEmailNotificationSdk _emailSDK;
        private readonly EmailServiceConfiguration _emailConfig;

        public NotificationManager(EmailServiceConfiguration emailService, IEmailNotificationSdk emailSDK, ILogger<NotificationManager> logger) : base(logger)
        {
            _emailConfig = emailService;
            _emailSDK = emailSDK;
        }

        async Task INotificationManager.SendFeedback(FeedbackRequest request)
        {
            var messageBody = FeedbackTextContent(request);

            var msg = new CommonDTO.EmailRequest()
            {
                Subject = "WestDAAT Feedback",
                TextContent = messageBody,
                From = _emailConfig.FeedbackFrom,
                To = _emailConfig.FeedbackTo,
            };

            await _emailSDK.SendEmail(msg);
        }

        private string FeedbackTextContent(FeedbackRequest request)
        {
            var messageBody = "";

            if (!string.IsNullOrEmpty(request.Name))
            {
                messageBody += GetBasicTextConfig("First Name", request.Name);
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                messageBody += GetBasicTextConfig("Last Name", request.LastName);
            }

            if (!string.IsNullOrWhiteSpace(request.SatisfactionLevel))
            {
                messageBody += GetBasicTextConfig("Satisfation", request.SatisfactionLevel);
            }

            if (!string.IsNullOrWhiteSpace(request.Comments))
            {
                messageBody += GetBasicTextConfig(nameof(request.Comments), request.Comments);
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                messageBody += GetBasicTextConfig(nameof(request.Email), request.Email);
            }

            if (!string.IsNullOrWhiteSpace(request.Organization))
            {
                messageBody += GetBasicTextConfig(nameof(request.Organization), request.Organization);
            }

            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                messageBody += GetBasicTextConfig(nameof(request.Role), request.Role);
            }

            if (request.DataUsage.Any())
            {
                messageBody += "Data Usage: \r\n";
                foreach (var use in request.DataUsage)
                {
                    messageBody += $"        - {use} \r\n";
                }
            }

            if (request.DataInterest.Any())
            {
                messageBody += "Data Interest: \r\n";
                foreach (var interest in request.DataInterest)
                {
                    messageBody += $"        - {interest} \r\n";
                }
            }

            return messageBody;
        }

        private string GetBasicTextConfig(string propertyName, string value)
        {
            return $"{propertyName}: \r\n        {value}\r\n";
        }
    }
}
