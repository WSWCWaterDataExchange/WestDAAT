using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IDocumentProcessingSdk
    {
        Task ToCsv<T>(IEnumerable<T> processing, string fileName);

        Task ToZip(dynamic collectionOfFiles);
    }
}
