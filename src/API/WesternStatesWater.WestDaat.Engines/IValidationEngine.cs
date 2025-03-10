using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;

namespace WesternStatesWater.WestDaat.Engines;

public interface IValidationEngine
{
    /// <summary>
    /// Validates the specified request against business rules, role-based access control (RBAC), 
    /// relationship-based access control (ReBAC), and other domain-specific logic.
    /// </summary>
    /// <param name="request">The request object to be validated.</param>
    /// <returns>
    /// A task that represents the asynchronous validation operation. 
    /// The result is an <see cref="ErrorBase"/> object describing the validation error, 
    /// or <c>null</c> if the request passes all validations.
    /// </returns>
    /// <remarks>
    /// This method is intended for advanced validation scenarios that go beyond structural checks, 
    /// focusing on access control and business-specific constraints.
    /// </remarks>
    Task<ErrorBase> Validate(RequestBase request);
}