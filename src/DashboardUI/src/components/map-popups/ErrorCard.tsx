import DangerousIcon from 'mdi-react/DangerousIcon';
import MapPopupCard from "./MapPopupCard";

function ErrorCard(props: { errorText: string; onClosePopup: () => void; }) {
  return (
    <MapPopupCard onClosePopup={props.onClosePopup}>
      {{
        header: "Error",
        body: <div className="text-center text-danger"><DangerousIcon /><div>{props.errorText}</div></div>
      }}
    </MapPopupCard>
  );
}
export default ErrorCard;