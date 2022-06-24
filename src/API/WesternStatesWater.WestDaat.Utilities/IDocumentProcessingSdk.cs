using CsvHelper;
using System.Collections;
using System.IO;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IDocumentProcessingSdk
    {
        Task<Stream> GetZipStreamFromCsv(List<IQueryable> filesToGenerate);
    }
}
