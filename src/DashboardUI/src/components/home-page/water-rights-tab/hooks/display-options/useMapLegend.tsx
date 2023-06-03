import { useContext, useEffect } from "react";
import { MapContext } from "../../../../../contexts/MapProvider";
import { useWadeLegend as useWadeMapLegend } from "./useWadeMapLegend";
import { useNldiMapLegend } from "./useNldiMapLegend";

export function useMapLegend() {
    const {
      setLegend,
    } = useContext(MapContext);

    const {legendItems: wadeLegendItems} = useWadeMapLegend();
    const {legendItems: nldiLegendItems} = useNldiMapLegend();

    useEffect(() => {
      setLegend(<>
        {wadeLegendItems}
        {nldiLegendItems}
      </>)
    }, [setLegend, wadeLegendItems, nldiLegendItems])

}