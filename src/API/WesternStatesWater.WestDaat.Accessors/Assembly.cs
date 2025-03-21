﻿global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using EF = WesternStatesWater.WaDE.Database.EntityFramework;
global using EFWD = WesternStatesWater.WestDaat.Database.EntityFramework;
using System.Resources;

[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.AccessorTests")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.EngineTests")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.IntegrationTests")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Client.Functions")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate")]
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("WesternStatesWater.WestDaat.Tools.JSONLDGenerator")]

[assembly: NeutralResourcesLanguage("en")] 