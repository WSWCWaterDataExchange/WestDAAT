import { mdiAlertCircle } from '@mdi/js';
import Icon from '@mdi/react';
import Alert from 'react-bootstrap/esm/Alert';
import Placeholder from 'react-bootstrap/esm/Placeholder';

export function TableLoading(props: { isLoading: boolean; isErrored?: boolean; children?: React.ReactNode }) {
  if (props.isErrored) {
    return (
      <Alert variant="danger" className="fw-bold d-flex align-items-center m-4">
        <Icon path={mdiAlertCircle} size="2em" className="me-2" />
        An error occurred while loading the data. Please try again.
      </Alert>
    );
  }

  return props.isLoading ? (
    <div className="d-flex mx-4">
      <table className="w-100">
        <thead>
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <td key={i} className="p-2 ps-0 border-bottom">
                <Placeholder animation="glow">
                  <Placeholder xs={12} style={{ height: 32 }} className="rounded" />
                </Placeholder>
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...Array(10).keys()].map((row) => (
            <tr key={row}>
              {[1, 2, 3, 4].map((col) => (
                <td key={col} className="p-2">
                  <Placeholder animation="glow">
                    <Placeholder xs={[4, 6, 8, 10, 4][(col * row) % 5]} style={{ height: 24 }} className="rounded" />
                  </Placeholder>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    props.children
  );
}
