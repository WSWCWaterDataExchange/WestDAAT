import { Card, Col, Row } from "react-bootstrap";
import Domain from "mdi-react/DomainIcon";
import HexagonOutlineIcon from "mdi-react/HexagonOutlineIcon";

import { PropertyValue } from "../PropertyValue";

import { useRegulationDetailsContext } from "./Provider";

function RegulationProperties() {
  const {
    hostData: {
      detailsQuery: { data: regulationDetails },
    },
  } = useRegulationDetailsContext();

  return (
    <div>
      {regulationDetails && (
        <Row className="pt-2">
          <Row className="pt-2">
            <Col>
              <Card className="regulation-card h-100 shadow-sm rounded-3">
                <Card.Header>
                  <HexagonOutlineIcon className="rotate-90" />
                  <span>Reporting Area Information</span>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex p-2 flex-column">
                    <PropertyValue
                      label="WaDE Area Reporting UUID"
                      value={regulationDetails.waDEAreaReportingUuid}
                    />
                    <PropertyValue
                      label="Reporting Area Native ID"
                      value={regulationDetails.reportingAreaNativeId}
                    />
                    <PropertyValue
                      label="WaDE Reporting Area Name"
                      value={regulationDetails.waDEReportingAreaName}
                    />
                    <PropertyValue
                      label="WaDE Overlay Area Type"
                      value={regulationDetails.waDEOverlayAreaType}
                    />
                    <PropertyValue
                      label="Native Reporting Area Type"
                      value={regulationDetails.nativeReportingAreaType}
                    />
                    <PropertyValue
                      label="Reporting Area Name"
                      value={regulationDetails.reportingAreaName}
                    />
                    <PropertyValue
                      label="State"
                      value={regulationDetails.reportingAreaState}
                    />
                    <PropertyValue
                      label="Area Last Updated Date"
                      value={regulationDetails.areaLastUpdated}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="pt-2">
            <Col>
              <Card className="regulation-card h-100 shadow-sm rounded-3">
                <Card.Header>
                  <Domain />
                  <span>Managing Agency</span>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex p-2 flex-column">
                    <PropertyValue
                      label="Organization Name"
                      value={regulationDetails.managingAgencyOrganizationName}
                    />
                    <PropertyValue
                      label="State"
                      value={regulationDetails.managingAgencyState}
                    />
                    <PropertyValue
                      label="Website"
                      value={regulationDetails.managingAgencyWebsite}
                      isUrl={true}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      )}
    </div>
  );
}

export default RegulationProperties;
