import { ReactNode } from 'react';
import { Card } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';

interface MapPopupCardProps {
  children: {
    header?: ReactNode;
    body?: ReactNode;
  };
  onClosePopup: () => void;
}
function MapPopupCard(props: MapPopupCardProps) {
  return (
    <Card className="map-popup-card">
      <CardHeader>
        <div className="d-flex justify-content-between flex-nowrap">
          {props.children.header}
          <button type="button" onClick={props.onClosePopup} className="btn-close map-popup-close-btn"></button>
        </div>
      </CardHeader>
      <div className="card-body">{props.children.body}</div>
    </Card>
  );
}
export default MapPopupCard;
