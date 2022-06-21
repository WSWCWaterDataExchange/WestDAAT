using CsvHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class DocumentProcessingSdk : IDocumentProcessingSdk
    {
        public Task ToCsv<T>(IEnumerable<T> fileToGenerate, string fileName)
        {
            var itemType = typeof(T);
            var props = itemType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                .OrderBy(p => p.Name);

            using var writer = new StreamWriter(fileName);
            using var csvWriter = new CsvWriter(writer, System.Globalization.CultureInfo.InvariantCulture);
            writer.WriteLine(string.Join(", ", props.Select(p => p.Name)));
            foreach (var item in fileToGenerate)
            {
                csvWriter.WriteField(string.Join(", ", props.Select(p => p.GetValue(item, null))));
            }
            throw new NotImplementedException();
        }

        public Task ToZip(dynamic collectionOfFiles)
        {
            throw new NotImplementedException();
        }
    }
}
