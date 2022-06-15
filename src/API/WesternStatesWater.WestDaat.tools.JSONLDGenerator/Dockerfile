#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src/API
COPY ["WesternStatesWater.WestDaat.tools.JSONLDGenerator/WesternStatesWater.WestDaat.Tools.JSONLDGenerator.csproj", "WesternStatesWater.WestDaat.tools.JSONLDGenerator/"]
COPY ["WesternStatesWater.WestDaat.Accessors/WesternStatesWater.WestDaat.Accessors.csproj", "WesternStatesWater.WestDaat.Accessors/"]
COPY ["WesternStatesWater.WestDaat.Common/WesternStatesWater.WestDaat.Common.csproj", "WesternStatesWater.WestDaat.Common/"]
COPY ["WesternStatesWater.WestDaat.Utilities/WesternStatesWater.WestDaat.Utilities.csproj", "WesternStatesWater.WestDaat.Utilities/"]
RUN dotnet restore "WesternStatesWater.WestDaat.tools.JSONLDGenerator/WesternStatesWater.WestDaat.Tools.JSONLDGenerator.csproj"
COPY . .
WORKDIR "/src/API/WesternStatesWater.WestDaat.tools.JSONLDGenerator"
RUN dotnet build "WesternStatesWater.WestDaat.Tools.JSONLDGenerator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WesternStatesWater.WestDaat.Tools.JSONLDGenerator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WesternStatesWater.WestDaat.Tools.JSONLDGenerator.dll"]