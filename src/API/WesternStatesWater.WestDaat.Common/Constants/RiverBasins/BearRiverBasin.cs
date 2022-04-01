using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Common.Constants.RiverBasins
{
    public static class BearRiverBasin
    {
        public const string BasinName = "Bear River Basin";

        public static Feature Feature
        {
            get
            {
                return new Feature
                {
                    Properties = new Dictionary<string, Object>
                    {
                        { "BasinName", BasinName },
                        { "Shape_Leng", 12.0152544406 },
                        { "Shape_Area", 2.10917515801 },
                    },
                    Geometry = new Polygon(new List<LineString>
                    {
                        new LineString(new List<IPosition>
                        {
new Position(longitude:-110.79666096399995,latitude:42.05932553200006),
new Position(longitude:-110.79371888199995,latitude:42.323083945000064),
new Position(longitude:-110.65157164899995,latitude:42.36859233700005),
new Position(longitude:-110.72561396899994,latitude:42.54246157100005),
new Position(longitude:-110.86309220399994,latitude:42.486100660000034),
new Position(longitude:-110.92571906599994,latitude:42.53254990900007),
new Position(longitude:-111.23492849399997,latitude:42.47828052400007),
new Position(longitude:-111.22255818599996,latitude:42.57272293200003),
new Position(longitude:-111.34218974599997,latitude:42.571625134000044),
new Position(longitude:-111.44563338599994,latitude:42.64537226300007),
new Position(longitude:-111.52462519899996,latitude:42.78261104000006),
new Position(longitude:-111.66832439099994,latitude:42.80960026200006),
new Position(longitude:-111.67585566099996,latitude:42.72179912000007),
new Position(longitude:-111.76978637899998,latitude:42.60914647100003),
new Position(longitude:-111.93812929999996,latitude:42.54170243900006),
new Position(longitude:-111.97592212899997,latitude:42.38566588000003),
new Position(longitude:-112.07300877899996,latitude:42.351464744000054),
new Position(longitude:-112.09776343299995,latitude:42.269402885000034),
new Position(longitude:-112.29079713699997,latitude:42.39532806200003),
new Position(longitude:-112.44371383699996,latitude:42.53568103200007),
new Position(longitude:-112.52587722199996,latitude:42.37525036000005),
new Position(longitude:-112.52320324599998,latitude:42.24609730700007),
new Position(longitude:-112.36363949799994,latitude:41.99908342100008),
new Position(longitude:-112.39678102699997,latitude:41.88388775800007),
new Position(longitude:-112.34395270799996,latitude:41.685569429000054),
new Position(longitude:-112.39672996799999,latitude:41.586076167000044),
new Position(longitude:-112.38593876599998,latitude:41.455990815000064),
new Position(longitude:-112.31085734499999,latitude:41.36966578200003),
new Position(longitude:-112.08212057899999,latitude:41.42732362800007),
new Position(longitude:-111.953339788,latitude:41.42853880200005),
new Position(longitude:-111.72574059499999,latitude:41.376317665000045),
new Position(longitude:-111.66721904099995,latitude:41.428722436000044),
new Position(longitude:-111.50789193399999,latitude:41.413808723000045),
new Position(longitude:-111.29548523499994,latitude:41.33044066000008),
new Position(longitude:-111.20621478099997,latitude:41.162226401000055),
new Position(longitude:-111.06903614699996,latitude:41.18276950000006),
new Position(longitude:-110.96268762899996,latitude:40.90793715700005),
new Position(longitude:-111.00452182099997,latitude:40.85954854400006),
new Position(longitude:-110.80654821699994,latitude:40.711631354000076),
new Position(longitude:-110.69681100399998,latitude:40.746735888000046),
new Position(longitude:-110.74502602199999,latitude:41.05885632300004),
new Position(longitude:-110.70557807499995,latitude:41.16467951200008),
new Position(longitude:-110.82412989499994,latitude:41.223533332000045),
new Position(longitude:-110.82967840599997,latitude:41.369510569000056),
new Position(longitude:-110.91266952899997,latitude:41.57047219400005),
new Position(longitude:-110.84754003599994,latitude:41.70841795100006),
new Position(longitude:-110.69693072499996,latitude:41.67746826800004),
new Position(longitude:-110.598526059,latitude:41.822869265000065),
new Position(longitude:-110.68841631999999,latitude:41.91990517100004),
new Position(longitude:-110.79721280299998,latitude:41.96876682800007),
new Position(longitude:-110.79666096399995,latitude:42.05932553200006)
                        })
                    })
                };
            }
        }
    }
}
