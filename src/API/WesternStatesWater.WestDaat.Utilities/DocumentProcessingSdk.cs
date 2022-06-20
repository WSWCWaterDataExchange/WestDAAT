using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class DocumentProcessingSdk : IDocumentProcessingSdk
    {
        public Task ToCsv<T>(T processing)
        {
            throw new NotImplementedException();
        }

        public Task ToZip(dynamic collectionOfFiles)
        {
            throw new NotImplementedException();
        }
    }
}
