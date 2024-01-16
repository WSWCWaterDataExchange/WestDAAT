import MapProvider from "../../../contexts/MapProvider";
import MainPanel from "../MainPanel";
import SidePanel from "../SidePanel";
import { useSiteSpecificContext, SiteSpecificProvider } from "./Provider";
import SideBar from "./SideBar";
import SSROMap from "../ssro-map";
import { useDisplayOptions } from "./hooks/display-options/useDisplayOptions";
import { useFilters } from "./hooks/filters/useFilters";
import { useMapUrlParameters } from "../hooks/useMapUrlParameters";
import { usePolylinesFilter } from "./hooks/filters/usePolylinesFilter";
import DownloadModal from "./DownloadModal";
import { useEffect } from "react";
import { useSiteSpecificPageContext } from "../ssro-Provider";
import { useMapFitRequested } from "./hooks/useMapFitRequested";

export function SiteSpecificTab () {
  return <MapProvider>
           <SiteSpecificProvider>
             <SiteSpecificLayout />
           </SiteSpecificProvider>
         </MapProvider>
}

function SiteSpecificLayout() {
  useDisplayOptions();
  useFilters();
  useMapUrlParameters();
  useDownloadModal();
  const {polylinesOnMapUpdated} = usePolylinesFilter();
  const {handleMapFitRequested} = useMapFitRequested();
  return <>
           <SidePanel>
             <SideBar />
           </SidePanel>
           <MainPanel>
             <SSROMap handleMapDrawnPolygonChange={polylinesOnMapUpdated} handleMapFitChange={handleMapFitRequested} />
           </MainPanel>
         </>
}

function useDownloadModal() {
  const {setDownloadModal} = useSiteSpecificPageContext()
  const {filters, nldiIds} = useSiteSpecificContext()
  useEffect(() =>{
    setDownloadModal(<DownloadModal filters={filters} nldiIds={nldiIds} />)
  }, [filters, nldiIds, setDownloadModal])
}