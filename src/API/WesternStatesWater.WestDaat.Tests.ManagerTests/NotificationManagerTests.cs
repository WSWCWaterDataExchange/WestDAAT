using CommonDTO = WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class NotificationManagerTests : ManagerTestBase
    {
        private readonly Mock<IEmailNotificationSDK> _emailNotificationSDK = new(MockBehavior.Strict);
        private INotificationManager Manager { get; set; }

        [TestInitialize]
        public void TestInitialize()
        {
            Manager = CreateNotificationManager();
        }

        [TestMethod]
        public async Task SendFeedback_Success()
        {
            var faker = new Faker();

            var feedbackRequest = new FeedbackRequest
            {
                Email = faker.Random.String(),
                Organization = faker.Random.String(),
                Role = faker.Random.String(),
                Comments = faker.Random.String(),
                SatisfactionLevel = faker.Random.String(),
                DataInterest = new string[] { faker.Random.String(), faker.Random.String() },
                DataUsage = new string[] { faker.Random.String(), faker.Random.String() }
            };

            CommonDTO.EmailRequest emailRequest = null;

            _emailNotificationSDK.Setup(a => a.SendEmail(It.IsAny<CommonDTO.EmailRequest>()))
                             .Callback<CommonDTO.EmailRequest>((request) => { emailRequest = request; })
                             .ReturnsAsync(true)
                             .Verifiable();

            await Manager.SendFeedback(feedbackRequest);

            emailRequest.Should().NotBeNull();
            emailRequest.Subject.Should().NotBeNull();
            emailRequest.Subject.Should().Be("WestDAAT Feedback");
            emailRequest.TextContent.Should().NotBeNull();
            emailRequest.TextContent.Should().Be("Please Enable HTML to display this message");
            emailRequest.To.Should().NotBeNullOrEmpty();
            emailRequest.To.Length.Should().Be(2);
            emailRequest.Body.Should().NotBeNullOrEmpty();
            emailRequest.Body.Should().StartWith("<div");
            emailRequest.Body.Should().EndWith("</div>");
            emailRequest.Body.Should().Contain(feedbackRequest.SatisfactionLevel);
            emailRequest.Body.Should().Contain(feedbackRequest.Organization);
            emailRequest.Body.Should().Contain(feedbackRequest.Role);
            emailRequest.Body.Should().Contain(feedbackRequest.Comments);
            emailRequest.Body.Should().Contain(feedbackRequest.Email);
            emailRequest.Body.Should().Contain(feedbackRequest.DataInterest[0]);
            emailRequest.Body.Should().Contain(feedbackRequest.DataInterest[1]);
            emailRequest.Body.Should().Contain(feedbackRequest.DataUsage[0]);
            emailRequest.Body.Should().Contain(feedbackRequest.DataUsage[1]);
        }

        [TestMethod]
        [DataRow("valid@email.com")]
        [DataRow("valid.ValidValid@email.com")]
        [DataRow("valid@email.com.es")]
        [DataRow("valid@[192.168.175.44]")]
        [DataRow("valid+valid@[192.168.175.44]")]
        [DataRow("valid_valid@[192.168.175.44]")]
        [DataRow("valid+valid@valid.com")]
        public async Task SendFeedback_AddFeedbackSenderToRecipients(string validEmail)
        {
            var faker = new Faker();

            var feedbackRequest = new FeedbackRequest
            {
                Email = validEmail,
                Organization = faker.Random.String(),
                Role = faker.Random.String(),
                Comments = faker.Random.String(),
                SatisfactionLevel = faker.Random.String(),
                DataInterest = new string[] { faker.Random.String(), faker.Random.String() },
                DataUsage = new string[] { faker.Random.String(), faker.Random.String() }
            };

            CommonDTO.EmailRequest emailRequest = null;

            _emailNotificationSDK.Setup(a => a.SendEmail(It.IsAny<CommonDTO.EmailRequest>()))
                             .Callback<CommonDTO.EmailRequest>((request) => { emailRequest = request; })
                             .ReturnsAsync(true)
                             .Verifiable();

            await Manager.SendFeedback(feedbackRequest);
            
            emailRequest.To.Length.Should().Be(3);
        }

        [TestMethod]
        [DataRow("almostvalid.com")]
        [DataRow("testing@testing.com@com.com")]
        [DataRow("not@valid@.com")]
        [DataRow("@gmail.com")]
        [DataRow("blank spaces@notValid.com")]
        [DataRow("blankSpaces@not Valid.com")]
        [DataRow("missing@notValid")]
        [DataRow("")]
        [DataRow(null)]
        public async Task SendFeedback_DoesNotAddEmailToList(string invalidEmail)
        {
            var faker = new Faker();

            var feedbackRequest = new FeedbackRequest
            {
                Email = invalidEmail,
                Organization = faker.Random.String(),
                Role = faker.Random.String(),
                Comments = faker.Random.String(),
                SatisfactionLevel = faker.Random.String(),
                DataInterest = new string[] { faker.Random.String(), faker.Random.String() },
                DataUsage = new string[] { faker.Random.String(), faker.Random.String() }
            };

            CommonDTO.EmailRequest emailRequest = null;

            _emailNotificationSDK.Setup(a => a.SendEmail(It.IsAny<CommonDTO.EmailRequest>()))
                             .Callback<CommonDTO.EmailRequest>((request) => { emailRequest = request; })
                             .ReturnsAsync(true)
                             .Verifiable();

            await Manager.SendFeedback(feedbackRequest);

            emailRequest.To.Length.Should().Be(2);
        }

        private INotificationManager CreateNotificationManager()
        {
            return new NotificationManager(
                _emailNotificationSDK.Object,
                CreateLogger<NotificationManager>()
            );
        }
    }
}
