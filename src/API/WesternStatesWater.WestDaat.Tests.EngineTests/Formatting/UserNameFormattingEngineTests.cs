using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Formatting;

[TestClass]
public class UserNameFormattingEngineTests : EngineTestBase
{
    private IUserNameFormattingEngine _formattingEngine;

    private Mock<IApplicationAccessor> _applicationAccessorMock;

    private Mock<IOrganizationAccessor> _organizationAccessorMock;

    private Mock<IUserAccessor> _userAccessorMock;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationAccessorMock = new Mock<IApplicationAccessor>();
        _organizationAccessorMock = new Mock<IOrganizationAccessor>();
        _userAccessorMock = new Mock<IUserAccessor>();

        _formattingEngine = new FormattingEngine(
            CreateLogger<FormattingEngine>(),
            Services.GetRequiredService<EnvironmentConfiguration>(),
            Services.GetRequiredService<EmailServiceConfiguration>(),
            _applicationAccessorMock.Object,
            _organizationAccessorMock.Object,
            _userAccessorMock.Object
        );
    }

    [DataTestMethod]
    [DataRow(0, true, DisplayName = "No conflicts, should only check once")]
    [DataRow(1, true, DisplayName = "One conflict, should check twice")]
    [DataRow(2, true, DisplayName = "Two conflicts, should check three times")]
    [DataRow(42, false, DisplayName = "Should stop checking after 10 and then throw")]
    public async Task Format_UserNameFormatRequest_ExistingUserName_ShouldRetry(int numberOfConflicts, bool shouldSucceed)
    {
        // Arrange
        var accessorCall = _userAccessorMock.SetupSequence(x => x.Load(It.IsAny<UserNameExistsRequest>()));
        for (var i = 0; i < numberOfConflicts; i++)
        {
            accessorCall.ReturnsAsync(new UserNameExistsResponse { Exists = true });
        }

        accessorCall.ReturnsAsync(new UserNameExistsResponse { Exists = false });


        if (shouldSucceed)
        {
            // Act
            var response = (UserProfileUserNameFormatResponse)await _formattingEngine.Format(new UserProfileUserNameFormatRequest
            {
                FirstName = "John",
                LastName = "Doe"
            });

            // Assert
            _userAccessorMock.Verify(x => x.Load(It.IsAny<UserNameExistsRequest>()), Times.Exactly(numberOfConflicts + 1));
            response.UserName.Should().StartWith("JDoe");
        }
        else
        {
            // Act
            Func<Task> act = async () => await _formattingEngine.Format(new UserProfileUserNameFormatRequest
            {
                FirstName = "John",
                LastName = "Doe"
            });

            // Assert
            await act.Should().ThrowAsync<WestDaatException>().WithMessage($"Unable to produce unique username after 10 attempts.");
            _userAccessorMock.Verify(x => x.Load(It.IsAny<UserNameExistsRequest>()), Times.Exactly(10));
        }
    }
}