import Button from 'react-bootstrap/esm/Button';

export function EstimationToolMapHeader() {
  return (
    <div className="p-3 d-flex flex-column gap-2 d-print-none">
      <div>
        <span className="h5 fw-bold">Estimate consumptive use through OpenET for an irrigated field</span>
      </div>

      <div>
        <span className="me-2">
          Click once to begin drawing a polygon around your land by using the shape tool. Then, use the panel on the
          left to review estimates and potential compensation as part of a voluntary and temporary measure.
        </span>
      </div>

      <div>
        <span className="me-2">Or, you can upload a file from your device.</span>

        <Button
          variant="outline-primary"
          onClick={() => alert('This feature will be implemented in a future release.')}
        >
          Upload File
        </Button>
      </div>
    </div>
  );
}
