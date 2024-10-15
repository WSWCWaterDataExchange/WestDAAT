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
    }
}