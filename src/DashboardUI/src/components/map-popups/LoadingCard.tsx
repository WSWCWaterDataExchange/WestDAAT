import { Spinner } from "react-bootstrap";
import MapPopupCard from "./MapPopupCard";

function LoadingCard(props: { loadingText: string; onClosePopup: () => void; }) {
  return (
    <MapPopupCard onClosePopup={props.onClosePopup}>
      {{
        header: "Loading",
        body: <div className="text-center"><div>{props.loadingText}</div><Spinner animation="border" /></div>
      }}
    </MapPopupCard>
  );
}
export default LoadingCard;