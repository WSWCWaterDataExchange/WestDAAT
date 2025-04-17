using System.Text.Json;
using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts.Converters;

public class RasterTimeSeriesPointRequestConverter : JsonConverter<RasterTimeSeriesPointRequest>
{
    public override RasterTimeSeriesPointRequest Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException("Deserialization is not supported for this object.");
    }

    public override void Write(Utf8JsonWriter writer, RasterTimeSeriesPointRequest value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();

        // Combine DateRangeStart and DateRangeEnd into a "date_range" property
        writer.WritePropertyName("date_range");
        writer.WriteStartArray();
        writer.WriteStringValue(value.DateRangeStart.ToString("yyyy-MM-dd"));
        writer.WriteStringValue(value.DateRangeEnd.ToString("yyyy-MM-dd"));
        writer.WriteEndArray();

        // Geometry 
        writer.WritePropertyName("geometry");
        var convertedGeometry = ConvertGeometryCoordinatesToFlattenedArray(value.Geometry);
        writer.WriteStartArray();
        foreach (var coord in convertedGeometry)
        {
            writer.WriteNumberValue(coord);
        }
        writer.WriteEndArray();


        // remaining fields
        writer.WriteString("file_format", value.OutputExtension.ToString());
        writer.WriteString("interval", value.Interval.ToString());
        writer.WriteString("model", value.Model.ToString());
        writer.WriteString("reference_et", value.ReferenceEt.ToString());
        writer.WriteString("units", ConvertRasterTimeseriesUnits(value.OutputUnits));
        writer.WriteString("variable", value.Variable.ToString());

        writer.WriteEndObject();
    }

    private double[] ConvertGeometryCoordinatesToFlattenedArray(NetTopologySuite.Geometries.Geometry geometry)
    {
        return geometry.Coordinates.Select(c => new double[] { c.X, c.Y }).SelectMany(x => x).ToArray();
    }

    private string ConvertRasterTimeseriesUnits(RasterTimeSeriesOutputUnits outputUnits)
    {
        return outputUnits switch
        {
            RasterTimeSeriesOutputUnits.Millimeters => "mm",
            RasterTimeSeriesOutputUnits.Inches => "in",
            _ => throw new NotImplementedException($"Output units {outputUnits} not implemented"),
        };
    }
}
