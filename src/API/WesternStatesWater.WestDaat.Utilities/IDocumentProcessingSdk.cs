using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IDocumentProcessingSdk
    {
        Task ToCsv<T>(T processing);

        Task ToZip(dynamic collectionOfFiles);
    }
}
