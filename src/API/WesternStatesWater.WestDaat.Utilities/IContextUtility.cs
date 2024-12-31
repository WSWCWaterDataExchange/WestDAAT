using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IContextUtility
{
    /// <summary>
    /// Retrieves the context as a <see cref="ContextBase"/> object.
    /// </summary>
    /// <returns>A <see cref="ContextBase"/> instance representing the current context.</returns>
    /// <remarks>
    /// This method is useful when context information is required but the specific type of the context is not known.
    /// </remarks>
    ContextBase GetContext();

    /// <summary>
    /// Retrieves the context as the specified type <typeparamref name="TContext"/>.
    /// </summary>
    /// <typeparam name="TContext">The specific type of context to retrieve. Must derive from <see cref="ContextBase"/>.</typeparam>
    /// <returns>
    /// An instance of <typeparamref name="TContext"/> representing the current context.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// Thrown if the current context cannot be cast to the specified type <typeparamref name="TContext"/>.
    /// </exception>
    /// <remarks>
    /// This method should be used when the context must be of a specific type. An exception is thrown if the context does not match.
    /// </remarks>
    TContext GetRequiredContext<TContext>() where TContext : ContextBase;
}