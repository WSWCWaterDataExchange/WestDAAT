using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;

namespace WesternStatesWater.WestDaat.Common.Constants.RiverBasins
{
    public static class TruckeeCarsonRiverBasin
    {
        public const string BasinName = "Truckee - Carson River Basin";

        public static Feature Feature
        {
            get
            {
                return new Feature
                {
                    Properties = new Dictionary<string, Object>
                    {
                        { "BasinName", BasinName },
                        { "Shape_Leng", 11.0686581072 },
                        { "Shape_Area", 2.37239182115 },
                    },
                    Geometry = new Polygon(new List<LineString>
                    {
                        new LineString(new List<IPosition>
                        {
new Position(longitude:-119.63322878799994,latitude:38.35225942000005),
new Position(longitude:-119.54409711599999,latitude:38.489786120000076),
new Position(longitude:-119.61930592699997,latitude:38.666085776000045),
new Position(longitude:-119.59944711899999,latitude:38.76299895900007),
new Position(longitude:-119.51522766699998,latitude:38.814331018000075),
new Position(longitude:-119.45762137099996,latitude:38.964815259000034),
new Position(longitude:-119.24835772999995,latitude:39.15407571800006),
new Position(longitude:-119.10931236299996,latitude:39.236270458000035),
new Position(longitude:-118.88813042999999,latitude:39.18260441900003),
new Position(longitude:-118.74061537099999,latitude:39.23703089000003),
new Position(longitude:-118.53780335399995,latitude:39.136555678000036),
new Position(longitude:-118.38080447699997,latitude:39.14268749900003),
new Position(longitude:-118.35144861299995,latitude:39.22143538200004),
new Position(longitude:-118.40191355599995,latitude:39.38120944000008),
new Position(longitude:-118.22522356899998,latitude:39.605935454000075),
new Position(longitude:-118.24313130599995,latitude:39.70935723000008),
new Position(longitude:-118.08888188799995,latitude:39.97020341700005),
new Position(longitude:-118.17295810899998,latitude:40.04743959800004),
new Position(longitude:-118.15237801299997,latitude:40.29974749000007),
new Position(longitude:-118.32761264799996,latitude:40.180189952000035),
new Position(longitude:-118.35298874199998,latitude:40.068302053000025),
new Position(longitude:-118.51228304299997,latitude:39.95721443300005),
new Position(longitude:-118.76423344199998,latitude:39.85629604600007),
new Position(longitude:-118.82182318299999,latitude:39.76312252900004),
new Position(longitude:-118.91471873299997,latitude:39.746776398000065),
new Position(longitude:-118.99297333299995,latitude:39.89337531600006),
new Position(longitude:-118.83636458299998,latitude:39.960988549000035),
new Position(longitude:-118.77274466399996,latitude:40.03707013700006),
new Position(longitude:-118.73745030899994,latitude:40.235462290000044),
new Position(longitude:-118.555397632,latitude:40.340789606000044),
new Position(longitude:-118.53170847299998,latitude:40.430587219000074),
new Position(longitude:-118.58390054199998,latitude:40.56494898200003),
new Position(longitude:-118.74672719499995,latitude:40.56689056700003),
new Position(longitude:-118.82247220399995,latitude:40.52273561100003),
new Position(longitude:-118.96856818599997,latitude:40.57037784600004),
new Position(longitude:-119.08139828899999,latitude:40.66935721600004),
new Position(longitude:-119.12831093999995,latitude:40.596443296000075),
new Position(longitude:-119.26328209099995,latitude:40.53740317200004),
new Position(longitude:-119.35346344099997,latitude:40.422567859000026),
new Position(longitude:-119.42423427299997,latitude:40.24206558100008),
new Position(longitude:-119.59726804399997,latitude:40.385611091000044),
new Position(longitude:-119.79752333699997,latitude:40.13613131200003),
new Position(longitude:-119.73852245499995,latitude:39.98860027200004),
new Position(longitude:-119.81714551199997,latitude:39.60065633500005),
new Position(longitude:-119.89573865299997,latitude:39.572062163000055),
new Position(longitude:-120.09449806999999,latitude:39.586227414000064),
new Position(longitude:-120.29975078599995,latitude:39.50387180100006),
new Position(longitude:-120.37346674399998,latitude:39.42926453700005),
new Position(longitude:-120.26191784499997,latitude:39.22094343900005),
new Position(longitude:-120.15292272699998,latitude:38.870296481000025),
new Position(longitude:-120.05541249399994,latitude:38.74821466900005),
new Position(longitude:-119.85099825699996,latitude:38.600703543000066),
new Position(longitude:-119.63322878799994,latitude:38.35225942000005)
                        })
                    })
                };
            }
        }
    }
}
