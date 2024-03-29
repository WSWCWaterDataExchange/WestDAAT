﻿using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;

namespace WesternStatesWater.WestDaat.Common.Constants.RiverBasins
{
    public static class ColoradoRiverBasin
    {
        public const string BasinName = "Colorado River Basin";

        public static Feature Feature
        {
            get
            {
                return new Feature
                {
                    Properties = new Dictionary<string, Object>
                    {
                        { "BasinName", BasinName },
                        { "Shape_Leng", 75.2878088768 },
                        { "Shape_Area", 67.0964280644 },
                    },
                    Geometry = new Polygon(new List<LineString>
                    {
                        new LineString(new List<IPosition>
                        {
new Position(longitude:-109.81980731199997,latitude:43.37415093300007),
new Position(longitude:-109.94856038499995,latitude:43.38786427800005),
new Position(longitude:-110.03922083299994,latitude:43.44938386900003),
new Position(longitude:-110.26644334399998,latitude:43.33567738200003),
new Position(longitude:-110.19540059699995,latitude:43.27663381200006),
new Position(longitude:-110.19082948299996,latitude:43.14921398000007),
new Position(longitude:-110.29939346499998,latitude:43.070171782000045),
new Position(longitude:-110.46681055299996,latitude:43.04617342800003),
new Position(longitude:-110.55785192899998,latitude:42.965797989000066),
new Position(longitude:-110.57270805299999,latitude:42.825617127000044),
new Position(longitude:-110.63289439999994,latitude:42.79247654300008),
new Position(longitude:-110.61518132999998,latitude:42.53744641600008),
new Position(longitude:-110.70869872499998,latitude:42.49059248700007),
new Position(longitude:-110.63917968399994,latitude:42.36488682300006),
new Position(longitude:-110.78393165999995,latitude:42.33650781700004),
new Position(longitude:-110.81402483399995,latitude:42.25518006200008),
new Position(longitude:-110.79269296399997,latitude:41.96034314100007),
new Position(longitude:-110.60661048899999,latitude:41.85882629500003),
new Position(longitude:-110.62394263399995,latitude:41.74016776600007),
new Position(longitude:-110.69708047399996,latitude:41.681314660000055),
new Position(longitude:-110.85706950099996,latitude:41.70340838300007),
new Position(longitude:-110.91897001699999,latitude:41.643602961000056),
new Position(longitude:-110.87687766599998,latitude:41.48380439700003),
new Position(longitude:-110.69803278999996,latitude:40.975648775000025),
new Position(longitude:-110.67403443599994,latitude:40.747283485000025),
new Position(longitude:-110.85535533299998,latitude:40.723475594000035),
new Position(longitude:-110.92849317399998,latitude:40.52101329000004),
new Position(longitude:-111.22790120899998,latitude:40.40959236100008),
new Position(longitude:-111.25247095299994,latitude:40.21589136100005),
new Position(longitude:-111.19590340399998,latitude:40.04333176800003),
new Position(longitude:-111.07057866699995,latitude:39.93572010100007),
new Position(longitude:-111.17209551299999,latitude:39.79744387100004),
new Position(longitude:-111.29094450499997,latitude:39.84753567300004),
new Position(longitude:-111.31437146899998,latitude:39.63650252900004),
new Position(longitude:-111.29208728299994,latitude:39.49460749900004),
new Position(longitude:-111.39055671999995,latitude:39.36509257200004),
new Position(longitude:-111.47721744199998,latitude:39.181486118000066),
new Position(longitude:-111.49588282899998,latitude:39.02206848000003),
new Position(longitude:-111.46540872899999,latitude:38.76780020600006),
new Position(longitude:-111.70120207999997,latitude:38.68647245100004),
new Position(longitude:-111.73034293799998,latitude:38.57790846800003),
new Position(longitude:-111.88195158799999,latitude:38.33373474000007),
new Position(longitude:-111.83547858399999,latitude:38.20821953900003),
new Position(longitude:-111.86900009499999,latitude:38.13889096100007),
new Position(longitude:-111.71358218399996,latitude:38.09317981000004),
new Position(longitude:-111.79510040099996,latitude:37.96690275700007),
new Position(longitude:-111.88918918599995,latitude:37.90824011400008),
new Position(longitude:-111.87433306199995,latitude:37.736442373000045),
new Position(longitude:-112.04155968799995,latitude:37.73701376300005),
new Position(longitude:-112.14155282999997,latitude:37.67797019300008),
new Position(longitude:-112.25506885299995,latitude:37.515505146000066),
new Position(longitude:-112.25678302199998,latitude:37.441034063000075),
new Position(longitude:-112.37753664399997,latitude:37.38446651500004),
new Position(longitude:-112.47029218699998,latitude:37.47188909000005),
new Position(longitude:-112.57028532799995,latitude:37.480650394000065),
new Position(longitude:-112.64323270599999,latitude:37.40465560600006),
new Position(longitude:-112.86093205999998,latitude:37.57797705100006),
new Position(longitude:-113.00854098399998,latitude:37.542931837000026),
new Position(longitude:-113.26414249999999,latitude:37.54426507800008),
new Position(longitude:-113.32204329099994,latitude:37.585024188000034),
new Position(longitude:-113.51155410299998,latitude:37.42370191900005),
new Position(longitude:-113.59402463599997,latitude:37.50864847300005),
new Position(longitude:-113.69154175799997,latitude:37.48084085600004),
new Position(longitude:-113.80239129699999,latitude:37.510743568000066),
new Position(longitude:-113.90714601699995,latitude:37.473984184000074),
new Position(longitude:-114.00713915899996,latitude:37.62978302200003),
new Position(longitude:-114.22674314399995,latitude:37.71053938800003),
new Position(longitude:-114.11836962499996,latitude:37.819674760000055),
new Position(longitude:-114.12560722299997,latitude:37.89871695800008),
new Position(longitude:-114.02980427099999,latitude:37.96176025300008),
new Position(longitude:-114.03589909099998,latitude:38.11565445900004),
new Position(longitude:-114.13455899099995,latitude:38.29983230300007),
new Position(longitude:-114.33283110599996,latitude:38.30249878700005),
new Position(longitude:-114.44615666699997,latitude:38.263072919000024),
new Position(longitude:-114.59871763099994,latitude:38.28021460100007),
new Position(longitude:-114.63909581399997,latitude:38.19031600500006),
new Position(longitude:-114.58443289699994,latitude:38.05375394200007),
new Position(longitude:-114.55243509099995,latitude:37.71720559800008),
new Position(longitude:-114.63814349799998,latitude:37.711110777000044),
new Position(longitude:-114.72251866299996,latitude:37.53950350000008),
new Position(longitude:-114.67928353399998,latitude:37.45703296600004),
new Position(longitude:-114.79870391499998,latitude:37.24580935800003),
new Position(longitude:-114.98459592699999,latitude:37.29571069700006),
new Position(longitude:-115.02783105599997,latitude:37.54083674200007),
new Position(longitude:-114.97964388499997,latitude:37.68958844400004),
new Position(longitude:-114.92631420899994,latitude:37.73034755300006),
new Position(longitude:-114.92936161999995,latitude:37.92957198400006),
new Position(longitude:-114.89012621499995,latitude:38.054325332000076),
new Position(longitude:-114.92269540999996,latitude:38.12479669000004),
new Position(longitude:-114.87774611199995,latitude:38.26535847700006),
new Position(longitude:-114.94117033299995,latitude:38.30002276600004),
new Position(longitude:-114.96459729899999,latitude:38.42744259800003),
new Position(longitude:-114.89679242499994,latitude:38.543244179000055),
new Position(longitude:-114.957359699,latitude:38.62666702900003),
new Position(longitude:-114.93412319799995,latitude:38.78360864600006),
new Position(longitude:-114.87393684999995,latitude:38.90321948900004),
new Position(longitude:-114.957359699,latitude:39.238244130000055),
new Position(longitude:-115.07697054299996,latitude:39.29728769900004),
new Position(longitude:-115.11220622099995,latitude:39.20396076700007),
new Position(longitude:-115.24724457899998,latitude:39.09349215300006),
new Position(longitude:-115.39561535499996,latitude:39.03711506800005),
new Position(longitude:-115.43485075899997,latitude:38.94512137700008),
new Position(longitude:-115.28457535099994,latitude:38.81579691400003),
new Position(longitude:-115.35142790899994,latitude:38.44858400500004),
new Position(longitude:-115.49598942199998,latitude:38.358494946000064),
new Position(longitude:-115.33923826999995,latitude:38.25888273100003),
new Position(longitude:-115.17677322199995,latitude:38.120225574000074),
new Position(longitude:-115.08173212199995,latitude:37.99680546800005),
new Position(longitude:-115.17620183199995,latitude:37.84043524100008),
new Position(longitude:-115.25048245199997,latitude:37.80177122600003),
new Position(longitude:-115.27600451099994,latitude:37.70406364200005),
new Position(longitude:-115.36933144299996,latitude:37.67358954100007),
new Position(longitude:-115.42570852899996,latitude:37.50979125300006),
new Position(longitude:-115.34419030999999,latitude:37.417607099000065),
new Position(longitude:-115.26419579699996,latitude:37.18981319900007),
new Position(longitude:-115.12801466199994,latitude:37.11934184200004),
new Position(longitude:-115.09030296199995,latitude:36.828885573000036),
new Position(longitude:-115.18058248399996,latitude:36.69156165800007),
new Position(longitude:-115.34419030999999,latitude:36.74108207100005),
new Position(longitude:-115.52151148099995,latitude:36.74889106000006),
new Position(longitude:-115.55903271799997,latitude:36.61861428100008),
new Position(longitude:-115.67292966799994,latitude:36.49252769100008),
new Position(longitude:-115.67235827799999,latitude:36.29806483800007),
new Position(longitude:-115.52246379699994,latitude:36.19826216000007),
new Position(longitude:-115.53065371099996,latitude:36.13579025400003),
new Position(longitude:-115.38361617699996,latitude:35.89333069300005),
new Position(longitude:-115.20819963799994,latitude:35.86685631800003),
new Position(longitude:-115.03754467599998,latitude:35.880950589000065),
new Position(longitude:-115.02440271999996,latitude:35.967420849000064),
new Position(longitude:-114.86422323,latitude:36.002656528000045),
new Position(longitude:-114.74327914499997,latitude:35.904758481000044),
new Position(longitude:-114.77527694999998,latitude:35.802860708000026),
new Position(longitude:-114.86288998799995,latitude:35.733151203000034),
new Position(longitude:-114.82270226899999,latitude:35.58668505900005),
new Position(longitude:-114.90307770799996,latitude:35.48783469600005),
new Position(longitude:-115.06230488199998,latitude:35.574114492000035),
new Position(longitude:-115.13010975499998,latitude:35.513356755000075),
new Position(longitude:-115.12858604999997,latitude:35.41488731800007),
new Position(longitude:-115.30990694799999,latitude:35.27889664500003),
new Position(longitude:-115.31828732499997,latitude:35.18099859900008),
new Position(longitude:-115.136966428,latitude:35.04843626200005),
new Position(longitude:-115.04230625399998,latitude:34.90292243300007),
new Position(longitude:-114.89145945699994,latitude:34.86349656500005),
new Position(longitude:-114.81127448099994,latitude:34.76350342400008),
new Position(longitude:-114.87355592299997,latitude:34.63741683400008),
new Position(longitude:-114.86727064099995,latitude:34.322009895000065),
new Position(longitude:-114.81546466999998,latitude:34.22144536400003),
new Position(longitude:-114.67833121799998,latitude:34.08793071200006),
new Position(longitude:-114.63757210999995,latitude:33.915180656000075),
new Position(longitude:-114.69147317399995,latitude:33.86623163200005),
new Position(longitude:-114.86517554599999,latitude:33.86813626300005),
new Position(longitude:-114.93945616499997,latitude:33.80128370600005),
new Position(longitude:-114.82822569899997,latitude:33.60415436900007),
new Position(longitude:-114.90022076199995,latitude:33.43121385000006),
new Position(longitude:-114.99678556699996,latitude:33.37559861700004),
new Position(longitude:-115.23600725399996,latitude:33.41826235700006),
new Position(longitude:-115.36514125399998,latitude:33.56110970300006),
new Position(longitude:-115.53351065899994,latitude:33.628152724000074),
new Position(longitude:-115.58836403899994,latitude:33.71233742600003),
new Position(longitude:-115.83482332599999,latitude:33.75881042900005),
new Position(longitude:-115.93253090999997,latitude:33.81156871500008),
new Position(longitude:-116.01081125499996,latitude:33.786427582000044),
new Position(longitude:-116.24927108999998,latitude:33.985461550000025),
new Position(longitude:-116.36583452399998,latitude:34.026220659000046),
new Position(longitude:-116.48868324099999,latitude:34.116309718000025),
new Position(longitude:-116.71057278399996,latitude:34.157068827000046),
new Position(longitude:-116.91055906699995,latitude:34.047552530000075),
new Position(longitude:-116.95550836499996,latitude:33.952892355000074),
new Position(longitude:-116.67286108399998,latitude:33.74566847300002),
new Position(longitude:-116.55934505999994,latitude:33.62472438700007),
new Position(longitude:-116.57610581599994,latitude:33.553300715000034),
new Position(longitude:-116.68162238899998,latitude:33.47825824300003),
new Position(longitude:-116.56010691299997,latitude:33.36817055600005),
new Position(longitude:-116.51610993099996,latitude:33.19827744600008),
new Position(longitude:-116.62791178699996,latitude:33.19637281400003),
new Position(longitude:-116.54696495699994,latitude:32.98133994400007),
new Position(longitude:-116.37707184799996,latitude:32.84630158700003),
new Position(longitude:-116.32488495099994,latitude:32.656028923000065),
new Position(longitude:-116.22679644099998,latitude:32.514133894000054),
new Position(longitude:-116.01404912799995,latitude:32.37966692600003),
new Position(longitude:-115.86739251999995,latitude:32.03892839100007),
new Position(longitude:-115.92072219599999,latitude:31.959886194000035),
new Position(longitude:-115.90605653499995,latitude:31.848465265000073),
new Position(longitude:-115.72702119499996,latitude:31.73685387200004),
new Position(longitude:-115.72321193299996,latitude:31.66752529400003),
new Position(longitude:-115.61293378299996,latitude:31.630004058000054),
new Position(longitude:-115.54684307799994,latitude:31.472871978000057),
new Position(longitude:-115.45370660799995,latitude:31.390972834000024),
new Position(longitude:-115.29314619299998,latitude:31.521630539000057),
new Position(longitude:-115.13620457599995,latitude:31.606577094000045),
new Position(longitude:-115.10953973799997,latitude:31.68161956600005),
new Position(longitude:-114.98802426299994,latitude:31.72733071600004),
new Position(longitude:-114.83260635099998,latitude:31.689047628000026),
new Position(longitude:-114.80803660799995,latitude:31.813610512000025),
new Position(longitude:-114.55814898499995,latitude:31.73799665100006),
new Position(longitude:-114.58881354799996,latitude:31.948458407000032),
new Position(longitude:-114.83774885599996,latitude:32.04749923300005),
new Position(longitude:-114.88288861699999,latitude:32.22501086700004),
new Position(longitude:-114.84003441299996,latitude:32.397570460000054),
new Position(longitude:-114.73680339899994,latitude:32.441948369000045),
new Position(longitude:-114.58690891699996,latitude:32.568034958000055),
new Position(longitude:-114.55319694399998,latitude:32.67317060500005),
new Position(longitude:-114.22750499699998,latitude:32.53298974300003),
new Position(longitude:-114.03856557499995,latitude:32.284625826000024),
new Position(longitude:-113.90257490199997,latitude:32.295291761000044),
new Position(longitude:-113.68468508399997,latitude:32.26615090300004),
new Position(longitude:-113.57916851199997,latitude:32.32843234500007),
new Position(longitude:-113.46831897199996,latitude:32.20977381600005),
new Position(longitude:-113.34851766499997,latitude:32.260817935000034),
new Position(longitude:-113.16129241099998,latitude:32.11416132700003),
new Position(longitude:-113.14548397199997,latitude:32.02635782500005),
new Position(longitude:-113.02415895999997,latitude:32.00331178700003),
new Position(longitude:-112.90435765299998,latitude:32.05035617900006),
new Position(longitude:-112.81217349999997,latitude:31.989598442000045),
new Position(longitude:-112.68703922599997,latitude:32.05492729500003),
new Position(longitude:-112.56266680299996,latitude:32.16577683400004),
new Position(longitude:-112.59733109199999,latitude:32.38176202100004),
new Position(longitude:-112.63599510699999,latitude:32.44575763100005),
new Position(longitude:-112.47829163799997,latitude:32.538703637000026),
new Position(longitude:-112.44400827499999,latitude:32.45432847200004),
new Position(longitude:-112.26249691499999,latitude:32.428806413000075),
new Position(longitude:-112.23297513099999,latitude:32.18520407400007),
new Position(longitude:-112.11241197099997,latitude:32.13301717600007),
new Position(longitude:-111.87947556699999,latitude:32.08483000500007),
new Position(longitude:-111.63206396499999,latitude:31.949982112000043),
new Position(longitude:-111.57625826799995,latitude:31.855893327000047),
new Position(longitude:-111.65263398299999,latitude:31.607719872000075),
new Position(longitude:-111.58540049799996,latitude:31.539914999000075),
new Position(longitude:-111.31665702699996,latitude:31.512107382000067),
new Position(longitude:-111.15685846299999,latitude:31.464682064000044),
new Position(longitude:-111.15628707299999,latitude:31.383354308000037),
new Position(longitude:-111.04429475499995,latitude:31.28126607300004),
new Position(longitude:-110.85326023799996,latitude:31.195557665000024),
new Position(longitude:-110.77040877799999,latitude:31.040711143000067),
new Position(longitude:-110.65117886099995,latitude:31.122610287000043),
new Position(longitude:-110.42128986599994,latitude:31.155369945000075),
new Position(longitude:-110.36796019099995,latitude:30.984143595000035),
new Position(longitude:-110.10207366499998,latitude:30.996142771000052),
new Position(longitude:-109.92494295699998,latitude:31.03309261800007),
new Position(longitude:-109.94056093399996,latitude:31.16755958600004),
new Position(longitude:-109.87980319599995,latitude:31.284884872000077),
new Position(longitude:-109.86818494499994,latitude:31.406209884000077),
new Position(longitude:-109.94646529099998,latitude:31.443159731000037),
new Position(longitude:-109.97217781299997,latitude:31.576102993000063),
new Position(longitude:-109.93751352399994,latitude:31.742948692000027),
new Position(longitude:-109.88723125799999,latitude:31.818181627000058),
new Position(longitude:-109.71276703399997,latitude:31.910556244000077),
new Position(longitude:-109.26898794799996,latitude:31.819133943000054),
new Position(longitude:-109.36155302699996,latitude:31.64219369800003),
new Position(longitude:-109.19356454999996,latitude:31.624480627000025),
new Position(longitude:-109.17528008999994,latitude:31.563341963000028),
new Position(longitude:-108.93624886499998,latitude:31.501441447000047),
new Position(longitude:-108.78159280599999,latitude:31.507536268000024),
new Position(longitude:-108.70350292399996,latitude:31.55800899600007),
new Position(longitude:-108.66636261399998,latitude:31.72218821200005),
new Position(longitude:-108.71035959699998,latitude:31.890557616000024),
new Position(longitude:-108.67759993899995,latitude:31.997597893000034),
new Position(longitude:-108.70426477599995,latitude:32.107685581000055),
new Position(longitude:-108.58636809999996,latitude:32.108066507000046),
new Position(longitude:-108.42599814799996,latitude:31.96845703500003),
new Position(longitude:-108.25248623899995,latitude:31.998931135000078),
new Position(longitude:-108.21896472799995,latitude:32.117208737000055),
new Position(longitude:-108.21001296099996,latitude:32.357192277000024),
new Position(longitude:-108.40847553999998,latitude:32.52289519800007),
new Position(longitude:-108.43190250399999,latitude:32.59679489100006),
new Position(longitude:-108.34257529799999,latitude:32.668789952000054),
new Position(longitude:-108.30981563999995,latitude:32.86763345700007),
new Position(longitude:-108.23439224199996,latitude:32.87125225700004),
new Position(longitude:-107.86356053399999,latitude:33.13942434000006),
new Position(longitude:-107.82184910899997,latitude:33.363789903000054),
new Position(longitude:-107.86603655399995,latitude:33.455783594000025),
new Position(longitude:-107.78661343099998,latitude:33.546444042000076),
new Position(longitude:-107.85441830399998,latitude:33.730812349000075),
new Position(longitude:-108.00831250999994,latitude:33.74090689500008),
new Position(longitude:-108.03612012699995,latitude:33.68967231400006),
new Position(longitude:-108.26429495299999,latitude:33.65767450800007),
new Position(longitude:-108.40485674099995,latitude:33.583012963000044),
new Position(longitude:-108.48142291699997,latitude:33.685672588000045),
new Position(longitude:-108.46332891999998,latitude:33.82033001800005),
new Position(longitude:-108.36485948399996,latitude:34.029839458000026),
new Position(longitude:-108.25420040699998,latitude:34.08221681900005),
new Position(longitude:-108.13897021499997,latitude:34.25972845300004),
new Position(longitude:-108.05821384999996,latitude:34.31667692800005),
new Position(longitude:-108.31800555399997,latitude:34.520282010000074),
new Position(longitude:-108.39685728899997,latitude:34.624846267000066),
new Position(longitude:-108.22963066399996,latitude:34.81588078300007),
new Position(longitude:-108.21991704399994,latitude:34.89758946500007),
new Position(longitude:-108.12906613199999,latitude:35.047674409000024),
new Position(longitude:-108.19172850099994,latitude:35.122526418000064),
new Position(longitude:-108.32733824799999,latitude:35.168428031000076),
new Position(longitude:-108.38409625899999,latitude:35.24366096600005),
new Position(longitude:-108.37704912399994,latitude:35.34746337100006),
new Position(longitude:-108.24410586199997,latitude:35.45602735400007),
new Position(longitude:-108.15573097099997,latitude:35.584780428000045),
new Position(longitude:-107.94050763699994,latitude:35.56401994700008),
new Position(longitude:-107.78699435699997,latitude:35.69372533600006),
new Position(longitude:-107.77975675699997,latitude:35.75314983200008),
new Position(longitude:-107.57024731799999,latitude:35.83657268200005),
new Position(longitude:-107.41178199699999,latitude:35.925709425000036),
new Position(longitude:-107.35788093099995,latitude:36.052938794000056),
new Position(longitude:-107.15084751199998,latitude:36.06436658200005),
new Position(longitude:-107.05923474799994,latitude:36.11064912100005),
new Position(longitude:-106.95124215599998,latitude:36.333300516000065),
new Position(longitude:-107.01714239799998,latitude:36.43386504700004),
new Position(longitude:-106.96152716399996,latitude:36.521287623000035),
new Position(longitude:-106.99942932599998,latitude:36.60718649300003),
new Position(longitude:-106.92895796999994,latitude:36.74984337500007),
new Position(longitude:-106.69868804899994,latitude:36.89802368800008),
new Position(longitude:-106.72440057099999,latitude:36.957448183000054),
new Position(longitude:-106.59050499299997,latitude:37.197622187000036),
new Position(longitude:-106.70059267999994,latitude:37.28142596300006),
new Position(longitude:-106.65507199299998,latitude:37.41951173000007),
new Position(longitude:-106.81334685199994,latitude:37.49093540300004),
new Position(longitude:-106.89772201699998,latitude:37.56388278000003),
new Position(longitude:-107.23674638299997,latitude:37.59321410200005),
new Position(longitude:-107.28645725899997,latitude:37.68635057100005),
new Position(longitude:-107.44987462199998,latitude:37.63111626500006),
new Position(longitude:-107.55101054199997,latitude:37.72120532300005),
new Position(longitude:-107.46911139799994,latitude:37.854529512000056),
new Position(longitude:-107.35197657399999,latitude:37.85110117600004),
new Position(longitude:-107.26550631399999,latitude:37.93376217300005),
new Position(longitude:-106.91162582499999,latitude:37.96861692500005),
new Position(longitude:-106.75392235599998,latitude:38.085751748000064),
new Position(longitude:-106.61793168299994,latitude:38.12517761600003),
new Position(longitude:-106.51451020499997,latitude:38.30230832400008),
new Position(longitude:-106.33928412799997,latitude:38.282690622000075),
new Position(longitude:-106.25471849999997,latitude:38.34535299100003),
new Position(longitude:-106.25052831099998,latitude:38.43410880700003),
new Position(longitude:-106.36594896599996,latitude:38.54076815800005),
new Position(longitude:-106.44480069999997,latitude:38.698662091000074),
new Position(longitude:-106.34099829599995,latitude:38.911599867000064),
new Position(longitude:-106.46060913999997,latitude:38.913123572000075),
new Position(longitude:-106.58974313999994,latitude:39.04092433000005),
new Position(longitude:-106.50403473299997,latitude:39.17424851900006),
new Position(longitude:-106.43299198699998,latitude:39.36128331000003),
new Position(longitude:-106.21167383299996,latitude:39.38585305300006),
new Position(longitude:-106.01797283299999,latitude:39.36623535100006),
new Position(longitude:-105.83417591599999,latitude:39.537461703000076),
new Position(longitude:-105.78351272299994,latitude:39.63136002400006),
new Position(longitude:-105.92140802699998,latitude:39.67688071200007),
new Position(longitude:-105.89207670599995,latitude:39.791729977000045),
new Position(longitude:-105.69532829499997,latitude:39.85020215700007),
new Position(longitude:-105.68294819199997,latitude:40.01914295000006),
new Position(longitude:-105.63380870599997,latitude:40.14637231900008),
new Position(longitude:-105.66009261699998,latitude:40.25855510100007),
new Position(longitude:-105.87855382399994,latitude:40.477587698000036),
new Position(longitude:-105.95797694699996,latitude:40.35359620100007),
new Position(longitude:-106.31319067999999,latitude:40.33797822500003),
new Position(longitude:-106.60669435799997,latitude:40.38007057600004),
new Position(longitude:-106.70763981599998,latitude:40.62748217800004),
new Position(longitude:-106.64059679499996,latitude:40.815088358000025),
new Position(longitude:-106.87124764199996,latitude:40.94631745300006),
new Position(longitude:-107.00247673699994,latitude:41.176587373000075),
new Position(longitude:-107.11637368699996,latitude:41.224203155000055),
new Position(longitude:-107.16360854199996,latitude:41.334862232000035),
new Position(longitude:-107.27617224999995,latitude:41.37371671000005),
new Position(longitude:-107.31331255899994,latitude:41.51542127700003),
new Position(longitude:-107.44454165399998,latitude:41.55103788100007),
new Position(longitude:-107.58281788499994,latitude:41.516373592000036),
new Position(longitude:-107.73614070099995,latitude:41.55922779600007),
new Position(longitude:-107.90127223199994,latitude:41.51427849700008),
new Position(longitude:-108.06297542699997,latitude:41.63522258300003),
new Position(longitude:-108.29514997999996,latitude:41.55122834400004),
new Position(longitude:-108.36962106199996,latitude:41.652745191000065),
new Position(longitude:-108.59189153099999,latitude:41.655983064000054),
new Position(longitude:-108.60179561399997,latitude:41.75159555400006),
new Position(longitude:-108.81130505399994,latitude:41.835970719000045),
new Position(longitude:-108.95853305099996,latitude:41.810639123000044),
new Position(longitude:-109.01929078899997,latitude:41.85825490500008),
new Position(longitude:-108.85263555199998,latitude:42.099190761000045),
new Position(longitude:-108.87491973799996,latitude:42.33803152200005),
new Position(longitude:-109.17775610999996,latitude:42.48430720300007),
new Position(longitude:-109.10157085899999,latitude:42.622964360000026),
new Position(longitude:-109.14728200999997,latitude:42.73571853100003),
new Position(longitude:-109.31907974999996,latitude:42.85494844800007),
new Position(longitude:-109.35564867,latitude:42.93284786800007),
new Position(longitude:-109.54458809299996,latitude:43.01322330700003),
new Position(longitude:-109.65753272699999,latitude:43.16559380900003),
new Position(longitude:-109.71105286599999,latitude:43.370722597000054),
new Position(longitude:-109.81980731199997,latitude:43.37415093300007)
                        })
                    })
                };
            }
        }
    }
}
