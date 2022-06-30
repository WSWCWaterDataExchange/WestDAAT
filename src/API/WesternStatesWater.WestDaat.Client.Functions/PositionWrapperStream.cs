using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class PositionWrapperStream : Stream
    {
        private readonly Stream wrapped;

        private long pos = 0;

        public PositionWrapperStream(Stream wrapped)
        {
            this.wrapped = wrapped;
        }

        public override bool CanSeek { get { return false; } }

        public override bool CanWrite { get { return true; } }

        public override long Position
        {
            get { return pos; }
            set { throw new NotSupportedException(); }
        }

        public override bool CanRead => throw new NotImplementedException();

        public override long Length => throw new NotImplementedException();

        public new async Task WriteAsync(byte[] buffer, int offset, int count)
        {
            pos += count;
            await wrapped.WriteAsync(buffer, offset, count);
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            pos += count;
            wrapped.Write(buffer, offset, count);
        }

        public new async Task FlushAsync()
        {
            await wrapped.FlushAsync();
        }

        public override void Flush()
        {
            wrapped.Flush();
        }
        public new async Task DisposeAsync()
        {
            await wrapped.DisposeAsync();
        }

        protected override void Dispose(bool disposing)
        {
            wrapped.Dispose();
            base.Dispose(disposing);
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            throw new NotImplementedException();
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotImplementedException();
        }

        public override void SetLength(long value)
        {
            throw new NotImplementedException();
        }

        // all the other required methods can throw NotSupportedException
    }
}
