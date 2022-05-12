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
        private readonly IEmailNotificationSDK _emailSDK;
        private readonly EmailServiceConfiguration _emailConfig;

        public NotificationManager(IEmailNotificationSDK emailSDK, EmailServiceConfiguration emailConfig, ILogger<NotificationManager> logger) : base(logger)
        {
            _emailSDK = emailSDK;
            _emailConfig = emailConfig;
        }

        async Task INotificationManager.SendFeedback(FeedbackRequest request)
        {
            var emailAddresses = _emailConfig.FeedbackTo;
            var messageBody = FeedbackMessageBody(request);

            var msg = new CommonDTO.EmailRequest()
            {
                Subject = "WestDAAT Feedback",
                TextContent = "Please Enable HTML to display this message",
                Body = messageBody,
                From = _emailConfig.FeedbackFrom,
                To = emailAddresses
            };

            await _emailSDK.SendEmail(msg);
        }

        private string FeedbackMessageBody(FeedbackRequest request)
        {
            // use some sort of whitelisting for the request or use an encoder to prevent injection
            var messageBody = "<div style=\"padding-left: 30px;\">";

            if (!string.IsNullOrEmpty(request.Name))
            {
                messageBody += GetMessageSection(nameof(request.Name), request.Name);
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                messageBody += GetMessageSection("Last Name", request.LastName);
            }

            if (!string.IsNullOrWhiteSpace(request.SatisfactionLevel))
            {
                messageBody += GetMessageSection("Satisfation", request.SatisfactionLevel);
            }

            if (!string.IsNullOrWhiteSpace(request.Comments))
            {
                messageBody += GetMessageSection(nameof(request.Comments), request.Comments);
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                messageBody += GetMessageSection(nameof(request.Email), request.Email);
            }

            if (!string.IsNullOrWhiteSpace(request.Organization))
            {
                messageBody += GetMessageSection(nameof(request.Organization), request.Organization);
            }

            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                messageBody += GetMessageSection(nameof(request.Role), request.Role);
            }

            if (request.DataUsage.Any())
            {
                messageBody += "<div style=\"padding-top: 20px;\">" +
                    "<label style=\"font-size: 20px; font-weight:bold; color: #003d4c; display:block; border-bottom: 1px solid #ccc;\">Data Usage</label>" +
                    "<ul style=\"margin-left: 10px; padding-left: 10px; margin-bottom: 0px;\">";
                foreach(var use in request.DataUsage)
                {
                    messageBody += $"<li><label>{use}</label></li>";
                }
                messageBody += "</div>";
            }

            if (request.DataInterest.Any())
            {
                messageBody += "<div style=\"padding-top: 20px;\">" +
                    "<label style=\"font-size: 20px; font-weight:bold; color: #003d4c; display:block; border-bottom: 1px solid #ccc;\">Data Interest</label>" +
                    "<ul style=\"margin-left: 10px; padding-left: 10px; margin-bottom: 0px;\">";
                foreach (var interest in request.DataInterest)
                {
                    messageBody += $"<li><label>{interest}</label></li>";
                }
                messageBody += "</div>";
            }

            return messageBody += "</div>";
        }

        private string GetMessageSection(string propertyName, string value)
        {
            return $"<div style=\"padding-top:20px;\">" +
                $"<label style=\"font-size: 20px; font-weight:bold; color: #003d4c; display:block; border-bottom: 1px solid #ccc;\">{propertyName}</label>" +
                $"<label style=\"padding-left: 20px;\">{value}</label>" +
                $"</div>";
        }
    }
}
