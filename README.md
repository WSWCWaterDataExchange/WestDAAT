# WSWC Allocation Site Mapbox Prototype

This repository hosts a proof-of-concept web application built to demonstrate [Mapbox GL GS](https://docs.mapbox.com/mapbox-gl-js/api/) within the context of mapping water site data gathered by the [Western States Water Council](https://www.westernstateswater.org/). Using Mapbox's hosted [vector tiles](https://docs.mapbox.com/help/glossary/vector-tiles/), this application takes advantage of [WebGL](https://en.wikipedia.org/wiki/WebGL) and abstracted water site data to create a responsive, performant user interface for the purpose of exploring WSWC data on water sites.

You can find a running demo of the prototype at https://wade-mapbox-prototype.azureedge.net.

_**DISCLAIMER:** This application is under construction, not for public use, and has not yet been fully approved by our member states. Individual states have unique water rights administration systems. Please check metadata before making any comparisons. The purpose of WaDE is to support regional water data and availability analysis. This data is not meant for localized decisions. Before drawing any conclusions or making comparisons, please consult the state's water rights agency and their used methods. Please also consult with the WaDE team before using this tool. We look forward to hear your feedback._

## Installation

This mapbox prototype uses [React](https://reactjs.org/) for rendering a static webpage, and [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) for the API used to fetch data from map interactions.

To begin using the prototype: 
- Install [Node Package Manager (npm)](https://www.npmjs.com/get-npm) and [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) by following the instructions on their respective webpages
- Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) to interact with the API, and (optional) install [VS Code](https://code.visualstudio.com/download) to interact with the client
- Clone this repository to your local machine
- Open the client (`~/mapbox-prototype`) in powershell and run `npm install` to fetch and install necessary dependencies.
- Open `~/MapboxPrototypeAPI.sln` in Visual Studio 2019 and click `Start` to run the API.
- Open `~/mapbox-prototype` in powershell and run `npm start` to run the client. Navigate to `localhost:3000` to interact with the map prototype.

**Note:** The Azure instance of the mapbox prototype loads its Mapbox API key from configured environment variables. To begin pulling data from Mapbox's hosted tiling service, you should [generate your own access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) (or use an organization access token) and place it in `~/mapbox-prototype/src/Map.js` at line 13 (e.g. `mapboxgl.accessToken = '[YOUR ACCESS TOKEN]';`)

## Updating Allocation Data

This prototype pulls rendered map elements from the [Mapbox Tiling Service](https://www.mapbox.com/mts), which has several advantages: Mapbox tiles are rendered in WebGL, automatically optimized across various zoom levels, and can be altered without redeploying the application through Azure. This section will document how to update mapbox tiles so that changes to WSWC data are reflected in the user interface.

### Broad Concepts
Mapbox's tiling service serves `.mbtiles` files to the user interface through the Mapbox GL JS API. These `.mbtiles` files are generated from [GeoJSON](https://geojson.org/https://geojson.org/) files using Mapbox's [Tippecanoe](https://github.com/mapbox/tippecanoe) tool.

WaDE's GeoJSON data can be generated from an API endpoint in the `MapboxPrototypeAPI.sln`, `/api/GetWaterAllocations`. This endpoint  starts by querying all available rows in the allocation database, formatting the query results into GeoJSON data, and saving the GeoJSON files to the user's local disk. Since the files are saved directly to your computer, you should run the API on your machine in order to generate GeoJSON.

In order to [display more data without sacrificing performance](https://source.opennews.org/articles/how-we-made-our-broadband-map-using-mapbox/) and to enable performant filtering, the generated GeoJSON is split into different files by beneficial use. These files are then compiled into two `.mbtiles` files using Tippecanoe, which can then be uploaded to Mapbox's tiling service.

### Pre-Requisites
In order to generate GeoJSON, compile `.mbtiles` files, and upload tiles to mapbox, make sure you:

- Can run the API on your local machine (See "Installation")
- Can access the desired WaDE database from your IP address
- Can access the Mapbox account used by the application
- Can run [tippecanoe](https://github.com/mapbox/tippecanoe). Unfortunately, tippecanoe needs a terminal command line in order to run. This means you cannot run tippecanoe directly in Windows. You can still use tippecanoe from your current OS by following these steps to install and run an Ubuntu terminal from Windows 10:

  - Open "Turn Windows Features On and Off"  from the start menu:  
![enter image description here](https://i.imgur.com/BACTnFT.png)

  - Enable "Windows Subsystem for Linux":
    ![enter image description here](https://i.imgur.com/Xj1EYQ2.png)
  - Install [Ubuntu 18.04 LTS](https://www.microsoft.com/en-us/p/ubuntu-1804-lts/9n9tngvndl3q?activetab=pivot:overviewtab) from the Windows Store
  - Restart your computer
  - Open Ubuntu from the start menu:
 ![enter image description here](https://i.imgur.com/FInr2ts.png)
  - Install [tippecanoe](https://github.com/mapbox/tippecanoe) by following the Ubuntu installation instructions in their readme (copied here for convenience - please check their repository to ensure instructions are up-to-date):
  
    - From the Ubuntu Command line, run the following commands:
    `$ git clone https://github.com/mapbox/tippecanoe.git`
    
`$ cd tippecanoe`

`$ make -j`

`$ make install`

### Updating Mabpox Tiles
1. Open the MapboxPrototypeAPI solution in Visual Studio
2. Ensure the following variables are set within the API:
    -  Line 71 of `WaterAllocationController.cs` should specify a directory with no spaces and naming scheme for the GeoJSON files to be written to (replace "`C:\Your\Preferred\Directory`" with a folder you've created somewhere on your disk)
    - Line 74 of `WaDE_QA_ServerContext.cs` and Line 39 of `Startup.cs` should both contain a [connection string](https://www.connectionstrings.com/sql-server/) to WaDE's desired database
3. Run the API by clicking the green play button in the toolbar
4. Using a tool such as [Postman](https://www.postman.com/), send a GET request to the `GetWaterAllocations` endpoint of your API instance (the URL will be displayed in a console window). Depending on the speed of your computer and your connection to the database, this request will run for 30-60 minutes.![enter image description here](https://i.imgur.com/2IbHEnV.png)
5. When the API finishes processing your request, you should have `.geojson` files in the directory specified in `WaterAllocationController.cs` (set in step 2):![enter image description here](https://i.imgur.com/X2F8iuD.png)
6. Open an Ubuntu terminal and navigate to this directory with no spaces (`$cd /mnt/c/[YOUR DIRECTORY]`). You'll know you're in the right directory if the command `$ls` lists your `.geojson` files.
7. Run both of these commands in this directory:
    - `tippecanoe -zg -o out1.mbtiles --read-parallel --coalesce-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L agricultural:"_Agricultural Allocations.geojson" -L aquaculture:"_Aquaculture Allocations.geojson" -L commercial:"_Commercial Allocations.geojson" -L domestic:"_Domestic Allocations.geojson" -L environmental:"_Environmental Allocations.geojson" -L fire:"_Fire Allocations.geojson" -L fish:"_Fish Allocations.geojson" -L flood:"_Flood Control Allocations.geojson" -L heating:"_Heating and Cooling Allocations.geojson" -L industrial:"_Industrial Allocations.geojson"`
    - `tippecanoe -zg -o out2.mbtiles --read-parallel --coalesce-densest-as-needed --extend-zooms-if-still-dropping --generate-ids --force -L instream:"_Instream Flow Allocations.geojson" -L livestock:"_Livestock Allocations.geojson" -L mining:"_Mining Allocations.geojson" -L municipal:"_Municipal Allocations.geojson" -L other:"_Other Allocations.geojson" -L power:"_Power Allocations.geojson" -L recharge:"_Recharge Allocations.geojson" -L recreation:"_Recreation Allocations.geojson" -L snow:"_Snow Making Allocations.geojson" -L storage:"_Storage Allocations.geojson" -L unknown:"_Unknown Allocations.geojson" -L wildlife:"_Wildlife Allocations.geojson"`

8. If the last step was done correctly, you should have two new files in your `.geojson` directory: `out1.mbtiles` and `out2.mbtiles`. These files need to be uploaded to mapbox's [tile service](https://studio.mapbox.com/tilesets/) - Find the tilesets labelled `out1-dnm4lx` and click into it. From here, click the 'replace' button and drag `out1.mbtiles` into the upload box. The tiles should automatically upload and update for the clients. Do the same for `out2-a8vt93` and `out2.mbtiles`.
9. The changes in your data should be evident from the mapbox tileset pages, however, because of caching done by mapbox's tile services, it may take some time for all users to see the updated data from the prototype application. Allow a maximum of 12 hours for changes to be reflected at all zoom levels in the prototype (**Note:** Closer zoom levels should reflect the changes almost immediately, please verify your data here first).
