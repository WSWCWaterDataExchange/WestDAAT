import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';
import Alert from 'react-bootstrap/esm/Alert';

export function NotImplementedPlaceholder() {
  return (
    <Alert className="m-3 fw-bold" variant="warning">
      <Icon path={mdiInformationOutline} size="2em" className="me-2" />
      This page will be implemented in a future release.
    </Alert>
  );
}
