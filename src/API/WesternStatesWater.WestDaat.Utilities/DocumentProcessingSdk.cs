using CsvHelper;
using System.Collections;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class DocumentProcessingSdk : IDocumentProcessingSdk
    {
        public async Task<File> ToCsv(IEnumerable fileToGenerate, string fileName)
        {
            byte[] bytes;
            using (var ms = new MemoryStream())
            {
                using (var writer = new StreamWriter(ms))
                {
                    using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                    {
                        await csv.WriteRecordsAsync(fileToGenerate);
                    }
                }

                bytes = ms.ToArray();
            }

            return new File
            {
                Bytes = bytes,
                FileName = fileName
            };
        }

        public async Task<File> ToZip(List<File> files)
        {
            var compressedFileStream = new MemoryStream();
            using (var zipArchive = new ZipArchive(compressedFileStream, ZipArchiveMode.Create, true))
            {
                foreach (var file in files)
                {
                    var zipEntry = zipArchive.CreateEntry(file.FileName);

                    using (var originalFileStream = new MemoryStream(file.Bytes))
                    using (var zipEntryStream = zipEntry.Open())
                    {
                        await originalFileStream.CopyToAsync(zipEntryStream);
                    }
                }
            }

            return new File()
            {
                Bytes = compressedFileStream.ToArray(),
                FileName = "waterrights.zip"
            };
        }
    }
}
