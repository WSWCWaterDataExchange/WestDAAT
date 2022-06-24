using CsvHelper;
using System.Collections;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class DocumentProcessingSdk : IDocumentProcessingSdk
    {
        public async Task<FileWrapper> ToCsv(IEnumerable fileToGenerate, string fileName)
        {
            byte[] bytes;
            var ms = new MemoryStream();
            using var writer = new StreamWriter(ms);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            await csv.WriteRecordsAsync(fileToGenerate);

            bytes = ms.ToArray();

            return new FileWrapper
            {
                Bytes = bytes,
                FileName = fileName
            };
        }

        public CsvWriter GetCsvStreamWriter(StreamWriter writer)
        {
            var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            return csv;
        }

        public async Task<FileWrapper> ToZip(List<FileWrapper> files)
        {
            var compressedFileStream = new MemoryStream();
            using (var zipArchive = new ZipArchive(compressedFileStream, ZipArchiveMode.Create, true))
            {
                foreach (var file in files)
                {
                    var zipEntry = zipArchive.CreateEntry($"{file.FileName}.csv");

                    using var originalFileStream = new MemoryStream(file.Bytes);
                    using var zipEntryStream = zipEntry.Open();
                    await originalFileStream.CopyToAsync(zipEntryStream);
                }
            }

            return new FileWrapper
            {
                Bytes = compressedFileStream.ToArray(),
                FileName = "waterrights.zip"
            };
        }

        public async Task<Stream> GetZipStreamFromCsv(List<CsvListModel> filesToGenerate)
        {
            using (var ms = new MemoryStream())
            {
                using (var zipArchive = new ZipArchive(ms, ZipArchiveMode.Create, true))
                {
                    using (var writer = new StreamWriter(ms))
                    {
                        foreach (var file in filesToGenerate)
                        {
                            var zipEntry = zipArchive.CreateEntry(file.FileName);

                            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                            {
                                foreach (var column in file.ColumnNames)
                                {
                                    csv.WriteField(column);
                                }

                                foreach (var data in file.Data)
                                {
                                    csv.WriteRecord(data);
                                    using var originalFileStream = new MemoryStream(ms.ToArray());
                                    using var zipEntryStream = zipEntry.Open();
                                    await originalFileStream.CopyToAsync(zipEntryStream);
                                }
                            }
                        }
                    }
                }
                return ms;
            }
        }
    }
}
