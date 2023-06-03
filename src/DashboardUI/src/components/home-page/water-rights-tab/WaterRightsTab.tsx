import MapProvider from "../../../contexts/MapProvider";
import MainPanel from "../MainPanel";
import SidePanel from "../SidePanel";
import TableView from "../TableView";
import { useWaterRightsContext, WaterRightsProvider } from "./Provider";
import SideBar from "./SideBar";
import Map from '../../map/Map';
import { useDisplayOptions } from "./hooks/display-options/useDisplayOptions";
import { useFilters } from "./hooks/filters/useFilters";
import { useMapUrlParameters } from "../hooks/useMapUrlParameters";
import { usePolylinesFilter } from "./hooks/filters/usePolylinesFilter";
import DownloadModal from "./DownloadModal";
import { useEffect } from "react";
import { useHomePageContext } from "../Provider";

export function WaterRightsTab () {
  return <MapProvider>
           <WaterRightsProvider>
             <WaterRightsLayout />
           </WaterRightsProvider>
         </MapProvider>
}

function WaterRightsLayout() {
  useDisplayOptions();
  useFilters();
  useMapUrlParameters();
  useDownloadModal();
  const {polylinesOnMapUpdated} = usePolylinesFilter();
  return <>
           <SidePanel>
             <SideBar />
           </SidePanel>
           <MainPanel>
             <Map handleMapDrawnPolygonChange={polylinesOnMapUpdated} />
             <TableView />
           </MainPanel>
         </>
}

function useDownloadModal() {
  const {setDownloadModal} = useHomePageContext()
  const {filters, nldiIds} = useWaterRightsContext()
  useEffect(() =>{
    setDownloadModal(<DownloadModal filters={filters} nldiIds={nldiIds} />)
  }, [filters, nldiIds, setDownloadModal])
}