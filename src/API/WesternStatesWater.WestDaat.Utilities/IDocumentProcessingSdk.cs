using System.Collections;
using System.IO;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IDocumentProcessingSdk
    {
        Task<File> ToCsv(IEnumerable processing, string fileName);
        Task<File> ToZip(List<File> files);
    }
}
