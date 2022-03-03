using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace WesternStatesWater.WestDaat.Common
{
    public class TimerLogger : IDisposable
    {
        private readonly Stopwatch _stopwatch = new Stopwatch();
        private readonly string _operationname;
        private readonly ILogger _logger;
        private bool _disposedValue;

        public TimerLogger(string operationname, ILogger logger)
        {
            _logger = logger;
            _operationname = operationname;
            _logger.Log(LogLevel.Debug, $"{_operationname}: Starting");
            _stopwatch.Start();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposedValue)
            {
                if (disposing)
                {
                    _stopwatch.Stop();
                    _logger.Log(LogLevel.Debug, $"{_operationname}: Completed [{_stopwatch.ElapsedMilliseconds}ms]");
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                _disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
