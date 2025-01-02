using FluentValidation.Results;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.Shared.Extensions;

public static class RequestExtensions
{
    /// <summary>
    /// Asynchronously validates the specified request using its associated validator.
    /// </summary>
    /// <returns>A task that represents the asynchronous validation operation. The result contains a <see cref="ValidationResult"/> with the details of the validation.</returns>
    /// <exception cref="TypeLoadException">
    /// Thrown when the corresponding validator for the request type cannot be found or does not implement the required <c>ValidateAsync</c> method.
    /// Ensure that a validator class named '<c>{RequestType}Validator</c>' exists in the same assembly and namespace as the request type 
    /// and extends <c>AbstractValidator&lt;TRequest&gt;</c>.
    /// </exception>
    public static async Task<ValidationResult> ValidateAsync<TRequest>(this TRequest request)
        where TRequest : RequestBase
    {
        var requestType = request.GetType();
        var validatorFullName = $"{requestType.FullName}Validator";

        try
        {
            var validator = Activator.CreateInstance(requestType.Assembly.FullName!, validatorFullName)!.Unwrap()!;
            var validatorType = validator.GetType();

            return await (Task<ValidationResult>)validatorType
                .GetMethod("ValidateAsync", [requestType, typeof(CancellationToken)])!
                .Invoke(validator, [request, CancellationToken.None])!;
        }
        catch (NullReferenceException ex)
        {
            throw new TypeLoadException(
                $"Validator '{validatorFullName}' does not have a matching 'ValidateAsync' method. " +
                $"Ensure that the validator extends 'AbstractValidator<{requestType.Name}>'.",
                ex
            );
        }
        catch (TypeLoadException ex)
        {
            throw new TypeLoadException(
                $"Validator '{requestType.Name}Validator' was not found for '{requestType.Name}'. " +
                $"You must place a '{requestType.Name}Validator' in the namespace of the request type ('{requestType.Namespace!}').",
                ex
            );
        }
    }
}