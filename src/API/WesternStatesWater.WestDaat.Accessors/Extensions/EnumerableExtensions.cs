namespace WesternStatesWater.WestDaat.Accessors.Extensions
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> ToEnumerable<T>(this IAsyncEnumerable<T> asyncEnumerable)
        {
            var enumerator = asyncEnumerable.GetAsyncEnumerator();
            try
            {
                while (enumerator.MoveNextAsync().AsTask().GetAwaiter().GetResult())
                {
                    yield return enumerator.Current;
                }
            }
            finally
            {
                enumerator.DisposeAsync().AsTask().GetAwaiter().GetResult();
            }
        }
    }
}