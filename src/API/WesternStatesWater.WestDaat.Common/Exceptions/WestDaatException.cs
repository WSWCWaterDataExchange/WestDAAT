using System.Diagnostics.CodeAnalysis;

namespace WesternStatesWater.WestDaat.Common.Exceptions
{
    public class WestDaatException : Exception
    {
        public WestDaatException()
        {
        }

        public WestDaatException(string message)
            : base(message)
        {
        }

        public WestDaatException(string message, Exception inner)
            : base(message, inner)
        {
        }

        public static void ThrowIfNull([NotNull] object @object, string message)
        {
            if (@object is null)
            {
                throw new WestDaatException(message);
            }
        }
    }
}