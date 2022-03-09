import { useContext, useEffect } from "react";
import { MapContext } from "./MapProvider";
import mapConfig from "../config/maps.json";

function AggregationsTab() {

  const { setCurrentSources, setCurrentLayers } = useContext(MapContext);

  useEffect(() => {
    setCurrentSources((mapConfig as any).aggregate.sources);
    setCurrentLayers((mapConfig as any).aggregate.layers);
  }, [setCurrentSources, setCurrentLayers])
  
  return (
    <h1>Aggregations</h1>
  );
}

export default AggregationsTab;
