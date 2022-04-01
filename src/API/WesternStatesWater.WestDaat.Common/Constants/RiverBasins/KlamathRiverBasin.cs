using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;

namespace WesternStatesWater.WestDaat.Common.Constants.RiverBasins
{
    public static class KlamathRiverBasin
    {
        public const string BasinName = "Klamath River Basin";

        public static Feature Feature
        {
            get
            {
                return new Feature
                {
                    Properties = new Dictionary<string, Object>
                    {
                        { "BasinName", BasinName },
                        { "Shape_Leng", 13.8944708426 },
                        { "Shape_Area", 4.39496132765 },
                    },
                    Geometry = new Polygon(new List<LineString>
                    {
                        new LineString(new List<IPosition>
                        {
new Position(longitude:-120.68835540499998,latitude:42.34959302000004),
new Position(longitude:-120.78407991099999,latitude:42.47689455600005),
new Position(longitude:-120.73413616899995,latitude:42.62662523500006),
new Position(longitude:-120.89015232899999,latitude:42.83723069900003),
new Position(longitude:-121.20985065499997,latitude:42.895901528000024),
new Position(longitude:-121.35075905699995,latitude:42.98253362400004),
new Position(longitude:-121.46279939799996,latitude:43.102050751000036),
new Position(longitude:-121.48934941099998,latitude:43.18173984200007),
new Position(longitude:-121.67062805899997,latitude:43.31540593900007),
new Position(longitude:-121.75491931199997,latitude:43.22546040900005),
new Position(longitude:-121.92146741899995,latitude:43.270518372000026),
new Position(longitude:-122.04107990099999,latitude:43.21600552600006),
new Position(longitude:-122.09314674499996,latitude:43.04478483100007),
new Position(longitude:-122.16931187199998,latitude:43.057392126000025),
new Position(longitude:-122.15016237399999,latitude:42.88677276900006),
new Position(longitude:-122.22395455599997,latitude:42.53630994500003),
new Position(longitude:-122.29344042599996,latitude:42.431900391000056),
new Position(longitude:-122.29475722799998,latitude:42.25016394100004),
new Position(longitude:-122.413270093,latitude:42.28627686200008),
new Position(longitude:-122.48140203399998,latitude:42.06918794500007),
new Position(longitude:-122.62279278599999,latitude:42.082768490000035),
new Position(longitude:-122.85071842899998,latitude:42.046456017000025),
new Position(longitude:-122.956788486,latitude:41.95486669500008),
new Position(longitude:-123.23711865299998,latitude:41.92359120500004),
new Position(longitude:-123.35241662799996,latitude:41.99920272600008),
new Position(longitude:-123.52214435999997,latitude:42.00014900100007),
new Position(longitude:-123.55884911899994,latitude:41.90648635300005),
new Position(longitude:-123.63674028199995,latitude:41.890933862000054),
new Position(longitude:-123.65756810599999,latitude:41.71813189400007),
new Position(longitude:-123.75446334099996,latitude:41.561210612000025),
new Position(longitude:-123.89552502899994,latitude:41.52304407400004),
new Position(longitude:-123.96896931399999,latitude:41.658885369000075),
new Position(longitude:-124.08684158999995,latitude:41.56872254600006),
new Position(longitude:-124.06133700899994,latitude:41.477243964000024),
new Position(longitude:-123.97290057699996,latitude:41.38204197600004),
new Position(longitude:-123.98412715999996,latitude:41.26326319800006),
new Position(longitude:-123.84979174299997,latitude:41.138916246000065),
new Position(longitude:-123.67434694699995,latitude:40.78127170700003),
new Position(longitude:-123.69701087599998,latitude:40.685509575000026),
new Position(longitude:-123.59288417299996,latitude:40.663540890000036),
new Position(longitude:-123.44353695299998,latitude:40.40511276400008),
new Position(longitude:-123.14647021199994,latitude:40.188227349000044),
new Position(longitude:-123.078214807,latitude:40.10999656100006),
new Position(longitude:-122.98769331299997,latitude:40.144271755000034),
new Position(longitude:-122.99832842399996,latitude:40.25678148600008),
new Position(longitude:-123.06833222499995,latitude:40.334697783000024),
new Position(longitude:-122.99862760799999,latitude:40.42975428300008),
new Position(longitude:-122.79076664299998,latitude:40.51351736500004),
new Position(longitude:-122.70325550399997,latitude:40.59494882400003),
new Position(longitude:-122.71673910499999,latitude:40.70296938200005),
new Position(longitude:-122.60391754999995,latitude:40.88932373000006),
new Position(longitude:-122.54189392599994,latitude:41.066766366000024),
new Position(longitude:-122.44602292199994,latitude:41.12981345000003),
new Position(longitude:-122.514058122,latitude:41.22310178200007),
new Position(longitude:-122.49915014699997,latitude:41.312031869000066),
new Position(longitude:-122.39252871699995,latitude:41.36865168600008),
new Position(longitude:-122.19148722899996,latitude:41.41278100000005),
new Position(longitude:-122.13012719799997,latitude:41.504589054000064),
new Position(longitude:-122.05110855999999,latitude:41.44900205700003),
new Position(longitude:-121.68253086399994,latitude:41.572224799000026),
new Position(longitude:-121.62031032799996,latitude:41.61327358900007),
new Position(longitude:-121.50765162899995,latitude:41.57653484100007),
new Position(longitude:-121.27921324899995,latitude:41.62530892700005),
new Position(longitude:-121.14927822899995,latitude:41.44123229000007),
new Position(longitude:-120.96442226999994,latitude:41.60306871700004),
new Position(longitude:-120.86644209599996,latitude:41.55191188100008),
new Position(longitude:-120.80835714899996,latitude:41.68328464600006),
new Position(longitude:-120.63081376499997,latitude:41.771106632000055),
new Position(longitude:-120.55490060299996,latitude:41.92634819300008),
new Position(longitude:-120.69936899799995,latitude:41.993885542000044),
new Position(longitude:-120.82874733299997,latitude:42.13718189100007),
new Position(longitude:-120.82602370099994,latitude:42.32626006500004),
new Position(longitude:-120.68835540499998,latitude:42.34959302000004)
                        })
                    })
                };
            }
        }
    }
}
