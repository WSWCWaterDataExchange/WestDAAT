import { useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';

interface ApplicationStaticMapProps {
  mapImageUrl: string | undefined;
}
function ApplicationStaticMap(props: ApplicationStaticMapProps) {
  const [imageLoadErrored, setImageLoadError] = useState(false);

  if (imageLoadErrored) {
    return (
      <Alert variant="warning" className="fw-bold  d-flex justify-content-center">
        Map image failed to load
      </Alert>
    );
  }

  return <img src={props.mapImageUrl} alt="Map" className="w-100" onError={() => setImageLoadError(true)} />;
}

export default ApplicationStaticMap;
