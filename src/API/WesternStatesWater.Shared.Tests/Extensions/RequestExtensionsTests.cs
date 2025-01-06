using FluentAssertions;
using FluentValidation;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Extensions;

namespace WesternStatesWater.Shared.Tests.Extensions;

[TestClass]
public class RequestExtensionsTests
{
    [TestMethod]
    public async Task ValidateAsync_ShouldReturnSuccessfulValidationResult()
    {
        var request = new ClassWithValidator { Id = 42 };

        var result = await request.ValidateAsync();

        result.IsValid.Should().BeTrue();
    }

    [TestMethod]
    public async Task ValidateAsync_ShouldReturnFailedValidationResult()
    {
        var request = new ClassWithValidator { Id = 43 };

        var result = await request.ValidateAsync();

        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors[0].ErrorMessage.Should().Be("'Id' must be less than '43'.");
    }

    [TestMethod]
    public async Task ValidateAsync_ValidatorNotFound_ShouldThrow()
    {
        var request = new ClassWithoutValidator();

        var message = await Assert.ThrowsExceptionAsync<TypeLoadException>(() => request.ValidateAsync());

        message.Message.Should().Be(
            "Validator 'ClassWithoutValidatorValidator' was not found for 'ClassWithoutValidator'. " +
            "You must place a 'ClassWithoutValidatorValidator' in the namespace of the request type " +
            "('WesternStatesWater.Shared.Tests.Extensions')."
        );
    }

    [TestMethod]
    public async Task ValidateAsync_ValidatorHasWrongType_ShouldThrow()
    {
        var request = new ClassWithWrongValidatorType { Id = 42 };

        var message = await Assert.ThrowsExceptionAsync<TypeLoadException>(() => request.ValidateAsync());

        message.Message.Should().Be(
            "Validator 'WesternStatesWater.Shared.Tests.Extensions.ClassWithWrongValidatorTypeValidator' " +
            "does not have a matching 'ValidateAsync' method. " +
            "Ensure that the validator extends 'AbstractValidator<ClassWithWrongValidatorType>'."
        );
    }
}

public class ClassWithValidator : RequestBase
{
    public int Id { get; init; }
}

public class ClassWithValidatorValidator : AbstractValidator<ClassWithValidator>
{
    public ClassWithValidatorValidator()
    {
        RuleFor(x => x.Id).GreaterThan(41).LessThan(43);
    }
}

public class ClassWithWrongValidatorType : RequestBase
{
    public int Id { get; init; }
}

public class ClassWithWrongValidatorTypeValidator : AbstractValidator<ClassWithValidator>;

public class ClassWithoutValidator : RequestBase
{
    public int Id { get; init; }
}