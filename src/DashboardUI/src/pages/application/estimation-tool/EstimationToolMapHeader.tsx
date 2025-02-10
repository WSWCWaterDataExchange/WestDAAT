import { Button, Col, Container, Row } from 'react-bootstrap';

export function EstimationToolMapHeader() {
  return (
    <Container>
      <Row>
        <Col>
          <div>
            <span className="h-2">Estimate consumptive use through OpenET for an irrigated field</span>
          </div>

          <div>
            <span className="me-2">
              Click once to begin drawing a polygon around your land by using the shape tool. Then, use the panel on the
              left to review estimates and potential compensation as part of a voluntary and temporary measure.
            </span>

            <a href="#">How does this work?</a>
          </div>

          <div>
            <span className="me-2">Or, you can upload a file from your device.</span>

            <Button variant="primary">Upload File</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
