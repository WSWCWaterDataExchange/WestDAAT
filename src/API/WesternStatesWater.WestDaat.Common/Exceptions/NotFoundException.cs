using System.Diagnostics.CodeAnalysis;

namespace WesternStatesWater.WestDaat.Common.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException()
        {
        }

        public NotFoundException(string message)
            : base(message)
        {
        }

        public NotFoundException(string message, Exception inner)
            : base(message, inner)
        {
        }

        public static void ThrowIfNull([NotNull] object @object, string message)
        {
            if (@object is null)
            {
                throw new NotFoundException(message);
            }
        }
    }
}