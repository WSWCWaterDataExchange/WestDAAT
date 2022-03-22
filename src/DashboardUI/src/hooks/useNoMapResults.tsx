import { useContext, useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { MapContext } from "../components/MapProvider";
import { mdiClose } from '@mdi/js';
import Icon from "@mdi/react";

import '../styles/no-map-results.scss'

function useNoMapResults(hasResults: boolean) {
  const {
    setMapAlert
  } = useContext(MapContext);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  useEffect(() => {
    if (hasResults && isManuallyClosed) {
      setIsManuallyClosed(false);
    }
  }, [hasResults, isManuallyClosed, setIsManuallyClosed])
  const noMapResultsCard = useMemo(() => (
    <div className="no-map-results-alert">
      <Card className="card">
        <CardHeader>
          <div className="d-flex justify-content-between">
            <h5 className="card-title">No Matching Results</h5>
            <div onClick={() => setIsManuallyClosed(true)}>
              <Icon path={mdiClose} title="close"></Icon>
            </div>
          </div>
        </CardHeader>
        <div className="card-body">Sorry, that filter combination has no results in view.<br />Please try different criteria or a different map location.</div>
      </Card>
    </div>), [setIsManuallyClosed])
  useEffect(() => {
    setMapAlert(hasResults || isManuallyClosed ? null : noMapResultsCard)
  }, [hasResults, isManuallyClosed, noMapResultsCard, setMapAlert])
}
export default useNoMapResults;