using System;
using System.Runtime.Serialization;

namespace WesternStatesWater.WestDaat.Common.Exceptions
{
    [Serializable]
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

        protected WestDaatException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
