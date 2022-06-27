using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;

namespace WesternStatesWater.WestDaat.Common.Constants.RiverBasins
{
    public static class PecosRiverBasin
    {
        public const string BasinName = "Pecos River Basin";

        public static Feature Feature
        {
            get
            {
                return new Feature
                {
                    Properties = new Dictionary<string, Object>
                    {
                        { "BasinName", BasinName },
                        { "Shape_Leng", 22.0622401084 },
                        { "Shape_Area", 11.0258442842 },
                    },
                    Geometry = new Polygon(new List<LineString>
                    {
                        new LineString(new List<IPosition>
                        {
new Position(longitude:-103.59046938299997,latitude:34.67927196100004),
new Position(longitude:-103.77287284199997,latitude:34.820846292000056),
new Position(longitude:-103.92450488199995,latitude:34.82707010800004),
new Position(longitude:-104.04932421599995,latitude:34.89924877900006),
new Position(longitude:-104.09315369599994,latitude:34.99111335900005),
new Position(longitude:-104.40805637099999,latitude:34.95080207600006),
new Position(longitude:-104.56980128499998,latitude:35.06007426600007),
new Position(longitude:-104.61849209499997,latitude:35.20187703000005),
new Position(longitude:-104.84113317699996,latitude:35.28219586500006),
new Position(longitude:-104.90935271499995,latitude:35.461303817000044),
new Position(longitude:-104.96211254599996,latitude:35.47901516100006),
new Position(longitude:-105.03846759799995,latitude:35.641479365000066),
new Position(longitude:-105.15697919199994,latitude:35.73023880100004),
new Position(longitude:-105.39661378499994,latitude:35.739407881000034),
new Position(longitude:-105.53669420599999,latitude:35.80848060100004),
new Position(longitude:-105.49796442799999,latitude:35.93292107900004),
new Position(longitude:-105.53639255399997,latitude:36.00075762500006),
new Position(longitude:-105.72106936899996,latitude:35.901126641000076),
new Position(longitude:-105.80366784899996,latitude:35.680606658000045),
new Position(longitude:-105.77129348699998,latitude:35.56200017200007),
new Position(longitude:-105.64797114299995,latitude:35.44060904300005),
new Position(longitude:-105.77023299399997,latitude:35.31993485400005),
new Position(longitude:-105.67315696599996,latitude:35.17916152300006),
new Position(longitude:-105.68804169999999,latitude:34.95198875900007),
new Position(longitude:-105.62545771999999,latitude:34.81797798800005),
new Position(longitude:-105.53312693699996,latitude:34.80301280500004),
new Position(longitude:-105.35877987099997,latitude:34.71091447300006),
new Position(longitude:-105.33969905399994,latitude:34.62941408000006),
new Position(longitude:-105.60788445299994,latitude:34.268672466000055),
new Position(longitude:-105.72705271899997,latitude:34.17474082100006),
new Position(longitude:-105.66847996399997,latitude:34.05548487500005),
new Position(longitude:-105.64214739599998,latitude:33.886913571000036),
new Position(longitude:-105.69085708199998,latitude:33.789558148000026),
new Position(longitude:-105.65727200299995,latitude:33.68303261600005),
new Position(longitude:-105.67868781399994,latitude:33.54257956500004),
new Position(longitude:-105.84029103899996,latitude:33.468102490000035),
new Position(longitude:-105.81313068499998,latitude:33.357016489000046),
new Position(longitude:-105.67025804399998,latitude:33.044771335000064),
new Position(longitude:-105.734294923,latitude:33.01508574500008),
new Position(longitude:-105.79676778999999,latitude:32.79838094300004),
new Position(longitude:-105.62179161199998,latitude:32.68333923500006),
new Position(longitude:-105.51043145199998,latitude:32.709389600000065),
new Position(longitude:-105.18623358399998,latitude:32.67462586700003),
new Position(longitude:-105.13119445399997,latitude:32.62372184000003),
new Position(longitude:-105.08854335399997,latitude:32.44341947300006),
new Position(longitude:-105.01268014699997,latitude:32.40650211800005),
new Position(longitude:-104.81643358599996,latitude:32.152443221000055),
new Position(longitude:-104.79741955399999,latitude:32.05519146300003),
new Position(longitude:-104.87993176899994,latitude:31.93042383200003),
new Position(longitude:-104.78018973499996,latitude:31.79757728800007),
new Position(longitude:-104.75437910399995,latitude:31.64444730100007),
new Position(longitude:-104.69127647399995,latitude:31.61513315800005),
new Position(longitude:-104.55209314699994,latitude:31.42282372300008),
new Position(longitude:-104.50187687699997,latitude:31.21165841800007),
new Position(longitude:-104.40957648699998,latitude:31.15867184600006),
new Position(longitude:-104.40752315799995,latitude:31.052696127000047),
new Position(longitude:-104.30255140199995,latitude:30.977234475000046),
new Position(longitude:-104.23245396299995,latitude:30.771887659000072),
new Position(longitude:-104.25364362799996,latitude:30.711013012000024),
new Position(longitude:-104.10351959699994,latitude:30.56013335600005),
new Position(longitude:-103.83693717699998,latitude:30.39982933500005),
new Position(longitude:-103.82631538299995,latitude:30.295148079000057),
new Position(longitude:-103.54929371499998,latitude:30.24118100800007),
new Position(longitude:-103.05340079099994,latitude:30.42555002100005),
new Position(longitude:-102.75521366099997,latitude:30.385698171000058),
new Position(longitude:-102.68003076199994,latitude:30.46134184700003),
new Position(longitude:-102.57388303499994,latitude:30.49177885000006),
new Position(longitude:-102.22268677899996,latitude:30.489820059000067),
new Position(longitude:-101.94892124099994,latitude:30.373783653000032),
new Position(longitude:-101.84172052399998,latitude:30.174295461000042),
new Position(longitude:-101.63384997299994,latitude:30.02790813200005),
new Position(longitude:-101.60955736099999,latitude:29.907729907000032),
new Position(longitude:-101.39149243899999,latitude:29.775664610000035),
new Position(longitude:-101.36959100999997,latitude:29.72350647600007),
new Position(longitude:-101.21736392099996,latitude:29.74850092400004),
new Position(longitude:-101.13194264699996,latitude:29.803933888000074),
new Position(longitude:-101.27635192299994,latitude:30.06287529100007),
new Position(longitude:-101.29261018899996,latitude:30.19175096400005),
new Position(longitude:-101.35215761199998,latitude:30.311373179000043),
new Position(longitude:-101.35439295799995,latitude:30.478305918000046),
new Position(longitude:-101.26838113799994,latitude:30.558126740000034),
new Position(longitude:-101.30184938099995,latitude:30.809026930000073),
new Position(longitude:-101.35407952599996,latitude:30.876939445000062),
new Position(longitude:-101.23827353799999,latitude:31.03958332800005),
new Position(longitude:-101.38889319499998,latitude:31.106317138000065),
new Position(longitude:-101.54165650599998,latitude:31.103847639000037),
new Position(longitude:-101.75034320099996,latitude:31.167898458000025),
new Position(longitude:-101.91488527099995,latitude:31.31099226200007),
new Position(longitude:-101.94024539299994,latitude:31.39953833000004),
new Position(longitude:-102.07891509399997,latitude:31.410498175000043),
new Position(longitude:-102.16616833999996,latitude:31.460134840000023),
new Position(longitude:-102.18979646799994,latitude:31.599349868000047),
new Position(longitude:-102.28042208299996,latitude:31.705528542000025),
new Position(longitude:-102.52911263199996,latitude:31.735138930000062),
new Position(longitude:-102.73427015499999,latitude:31.90671534200004),
new Position(longitude:-102.83933249699999,latitude:32.240336984000066),
new Position(longitude:-102.95010375599998,latitude:32.392063034000046),
new Position(longitude:-103.16768962599997,latitude:32.614371205000054),
new Position(longitude:-103.40182742799999,latitude:32.75152617200007),
new Position(longitude:-103.55127339099994,latitude:32.79003235500005),
new Position(longitude:-103.84996798199995,latitude:33.02908769700008),
new Position(longitude:-103.80197911899995,latitude:33.09209797400007),
new Position(longitude:-103.77764904899999,latitude:33.36852240700006),
new Position(longitude:-103.67291035299996,latitude:33.484441676000074),
new Position(longitude:-103.63667291599995,latitude:33.595279651000055),
new Position(longitude:-103.72408275699996,latitude:33.83841688000007),
new Position(longitude:-103.79617306699998,latitude:33.93639052000003),
new Position(longitude:-103.78443917699997,latitude:34.13661633800007),
new Position(longitude:-103.84345994999995,latitude:34.26076858700003),
new Position(longitude:-103.82781204699995,latitude:34.37019304900008),
new Position(longitude:-103.74201892199994,latitude:34.50134668000004),
new Position(longitude:-103.66419969699996,latitude:34.55209690000004),
new Position(longitude:-103.59046938299997,latitude:34.67927196100004)
                        })
                    })
                };
            }
        }
    }
}
