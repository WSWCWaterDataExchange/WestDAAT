namespace WesternStatesWater.WestDaat.Contracts.Client.SmokeTest
{
    public class SmokeTestResult
    {
        public string Manager { get; set; }

        public string[] Engines { get; set; }

        public string[] Accessors { get; set; }

        public string[] Utilities { get; set; }
    }

    public class TokenResult
    {
        public Token Data { get; set; }
    }

    public class Token
    {
        public string TokenValue { get; set; }
    }
}
