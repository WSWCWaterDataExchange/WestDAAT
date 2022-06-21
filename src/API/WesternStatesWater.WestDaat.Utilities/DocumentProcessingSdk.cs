using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class DocumentProcessingSdk : IDocumentProcessingSdk
    {
        public async Task ToCsv<T>(IEnumerable<T> fileToGenerate, string fileName)
        {
            using (var writer = new StreamWriter($"{fileName}.csv"))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                await csv.WriteRecordsAsync(fileToGenerate);

                Console.WriteLine(csv.ToString());
                Console.WriteLine(writer.ToString());
            }

            throw new NotImplementedException();
        }

        public Task ToZip(dynamic collectionOfFiles)
        {
            throw new NotImplementedException();
        }
    }
}
