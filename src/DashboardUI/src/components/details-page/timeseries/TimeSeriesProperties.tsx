import { Card, Col, Row } from "react-bootstrap";
import Domain from "mdi-react/DomainIcon";
import MapMarker from "mdi-react/MapMarkerIcon";
import ClipBoardSearch from "mdi-react/ClipboardSearchIcon";
import { ApiData } from "./ApiInterface";
import "./time.scss";
import TimeMap from "./time-series-map/TimeMap";
import MapProvider from "../../../contexts/MapProvider";
import WaterCircle from "mdi-react/WaterCircleIcon";

import TimeSeriesTabs from "./TimeSeriesTabs";

interface TimeSeriesPropertiesProps {
  apiData: ApiData[] | null;
  setPageTypeNameString: React.Dispatch<React.SetStateAction<string>>;
}

function TimeSeriesProperties({ apiData, setPageTypeNameString }: TimeSeriesPropertiesProps) {
  // Initialize organizationName with an empty string or some default value because of typescript
  let organizationName = "";
  let organizationState = "";
  let organizationWebsite = "";
  let organizationPurview = "";
  let organizationPhoneNumber = "";
  let organizationContactName = "";
  let organizationContactEmail = "";
  let applicableResourceType = "";
  let methodType = "";
  let methodLink = "";
  let methodDescription = "";
  let wadeSiteID = "";
  let siteNativeID = "";
  let siteName = "";
  let longitude = "";
  let latitude = "";
  let county = "";
  let siteType = "";
  let podPou = "";
  let methodUUID = "";
  let methodName = "";
  let dataCoverageValue = "";
  let dataQualityValue = "";
  let dataConfidenceValue = "";

  let coordinateMethodCV = "";
  let allocationGNISIDCV = "";
  let hUC8 = "";
  let hUC12 = "";

  let variableCV = "";

  let associatedNativeAllocationIDs = "";

  function checkIfEmpty(obj: string) {
    if (obj === "" || obj === null) {
      return "...";
    }
    return obj;
  }

  if (Object(apiData) !== null && Object(apiData).TotalSiteVariableAmountsCount !== undefined) {
    if (Object(apiData).TotalSiteVariableAmountsCount !== 0) {
      // Check if apiData is not null assign to api members
      organizationName = Object(apiData).Organizations[0].OrganizationName;
      organizationState = Object(apiData).Organizations[0].OrganizationState;
      organizationWebsite = Object(apiData).Organizations[0].OrganizationWebsite;
      organizationPhoneNumber = Object(apiData).Organizations[0].OrganizationPhoneNumber;
      organizationPurview = Object(apiData).Organizations[0].OrganizationPurview;
      organizationContactName = Object(apiData).Organizations[0].OrganizationContactName;
      organizationContactEmail = Object(apiData).Organizations[0].OrganizationContactEmail;

      applicableResourceType = Object(apiData).Organizations[0].Methods[0].ApplicableResourceType;
      methodType = Object(apiData).Organizations[0].Methods[0].MethodTypeCV;
      methodLink = Object(apiData).Organizations[0].Methods[0].MethodNEMILink;
      methodDescription = Object(apiData).Organizations[0].Methods[0].MethodDescription;
      methodName = Object(apiData).Organizations[0].Methods[0].MethodName;
      methodUUID = Object(apiData).Organizations[0].Methods[0].MethodUUID;
      dataCoverageValue = Object(apiData).Organizations[0].Methods[0].DataCoverageValue;
      dataQualityValue = Object(apiData).Organizations[0].Methods[0].DataQualityValue;
      dataConfidenceValue = Object(apiData).Organizations[0].Methods[0].DataConfidenceValue;

      wadeSiteID = Object(apiData).Organizations[0].Sites[0].SiteUUID;
      siteNativeID = Object(apiData).Organizations[0].Sites[0].NativeSiteID;
      siteName = Object(apiData).Organizations[0].Sites[0].SiteName;
      longitude = Object(apiData).Organizations[0].Sites[0].Longitude;
      latitude = Object(apiData).Organizations[0].Sites[0].Latitude;
      county = Object(apiData).Organizations[0].Sites[0].County;
      siteType = Object(apiData).Organizations[0].Sites[0].SiteTypeCV;
      podPou = Object(apiData).Organizations[0].Sites[0].PODorPOUSite;

      coordinateMethodCV = Object(apiData).Organizations[0].Sites[0].CoordinateMethodCV;
      allocationGNISIDCV = Object(apiData).Organizations[0].Sites[0].AllocationGNISIDCV;
      hUC8 = Object(apiData).Organizations[0].Sites[0].HUC8;
      hUC12 = Object(apiData).Organizations[0].Sites[0].HUC12;

      variableCV = Object(apiData).Organizations[0].VariableSpecifics[0].VariableCV;
    }
  }

  setPageTypeNameString(variableCV);

  return (
    <>
      <div className="all-cards ">
        {
          <Row className="pt-2">
            <Row>
              <Col className="cards">
                <Card className="site-card h-100 shadow-sm rounded-3">
                  <Card.Header className="site-header">
                    <ClipBoardSearch />
                    <span>Site Information</span>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex p-2 flex-column">
                      <p className="p-header">WaDE Site ID: </p>
                      <p className="p-description">{checkIfEmpty(wadeSiteID)}</p>
                      <p className="p-header">Site Native ID: </p>
                      <p className="p-description">{checkIfEmpty(siteNativeID)}</p>
                      <p className="p-header">Site Name: </p>
                      <p className="p-description">{checkIfEmpty(siteName)}</p>
                      <p className="p-header">Longitude: </p>
                      <p className="p-description">{checkIfEmpty(longitude)}</p>
                      <p className="p-header">Latitude: </p>
                      <p className="p-description">{checkIfEmpty(latitude)}</p>
                      <p className="p-header">County: </p>
                      <p className="p-description">{checkIfEmpty(county)}</p>
                      <p className="p-header">Site Type: </p>
                      <p className="p-description">{checkIfEmpty(siteType)}</p>
                      <p className="p-header">POD or POU: </p>
                      <p className="p-description">{checkIfEmpty(podPou)}</p>
                      <p className="p-header">Coordinate Method CV: </p>
                      <p className="p-description">{checkIfEmpty(coordinateMethodCV)}</p>
                      <p className="p-header">Allocation GNISIDCV: </p>
                      <p className="p-description">{checkIfEmpty(allocationGNISIDCV)}</p>
                      <p className="p-header">HUC8: </p>
                      <p className="p-description">{checkIfEmpty(hUC8)}</p>
                      <p className="p-header">HUC12: </p>
                      <p className="p-description">{checkIfEmpty(hUC12)}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="cards">
                <Card className="site-card h-100 shadow-sm rounded-3">
                  <Card.Header className="site-header">
                    <MapMarker />
                    <span>Map</span>
                  </Card.Header>
                  <Card.Body>
                    <MapProvider>
                      <TimeMap apiData={apiData} />
                    </MapProvider>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <TimeSeriesTabs apiData={apiData} />

            <Row>
              <Col>
                <Card className="site-card h-100 shadow-sm rounded-3">
                  <Card.Header className="site-header">
                    <Domain />
                    <span>Managing Organization Agency</span>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex p-2 flex-column">
                      <p className="p-header">Organization Name: </p>
                      <p className="p-description">{checkIfEmpty(organizationName)}</p>
                      <p className="p-header">Organization Purview:</p>
                      <p className="p-description">{checkIfEmpty(organizationPurview)}</p>
                      <p className="p-header">Website:</p>
                      {checkIfEmpty(organizationWebsite) !== "..." ? (
                        <p className="p-description">
                          {" "}
                          <a href={`${checkIfEmpty(organizationWebsite)}`} target="_blank">
                            {checkIfEmpty(organizationWebsite)}
                          </a>
                        </p>
                      ) : (
                        <p>{checkIfEmpty(organizationWebsite)}</p>
                      )}
                      <p className="p-header">Organization Phone Number: </p>
                      <p className="p-description">{checkIfEmpty(organizationPhoneNumber)}</p>
                      <p className="p-header">Organization Contact Name:</p>
                      <p className="p-description">{checkIfEmpty(organizationContactName)}</p>
                      <p className="p-header">Organization Contact Email:</p>
                      <p className="p-description">{checkIfEmpty(organizationContactEmail)}</p>
                      <p className="p-header">Organization State:</p>
                      <p className="p-description">{checkIfEmpty(organizationState)}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="site-card h-100 shadow-sm rounded-3">
                  <Card.Header className="site-header">
                    <WaterCircle />
                    <span>Method Information</span>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex p-2 flex-column">
                      <p className="p-header">Method UUID: </p>
                      <p className="p-description">{checkIfEmpty(methodUUID)}</p>
                      <p className="p-header">Method Name: </p>
                      <p className="p-description">{checkIfEmpty(methodName)}</p>
                      <p className="p-header">Method Description: </p>
                      <p className="p-description">{checkIfEmpty(methodDescription)}</p>
                      <p className="p-header">Method NEMI Link: </p>
                      {checkIfEmpty(methodLink) !== "..." ? (
                        <p className="p-description">
                          {" "}
                          <a href={`${checkIfEmpty(methodLink)}`} target="_blank">
                            {checkIfEmpty(methodLink)}
                          </a>
                        </p>
                      ) : (
                        <p>{checkIfEmpty(methodLink)}</p>
                      )}
                      <p className="p-header">Applicable Resource Type: </p>
                      <p className="p-description">{checkIfEmpty(applicableResourceType)}</p>
                      <p className="p-header">Method Type CV: </p>
                      <p className="p-description">{checkIfEmpty(methodType)}</p>
                      <p className="p-header">Data Coverage Value: </p>
                      <p className="p-description">{checkIfEmpty(dataCoverageValue)}</p>
                      <p className="p-header">Data Quality Value: </p>
                      <p className="p-description">{checkIfEmpty(dataQualityValue)}</p>
                      <p className="p-header">Data Confidence Value: </p>
                      <p className="p-description">{checkIfEmpty(dataConfidenceValue)}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Row>
        }
      </div>
    </>
  );
}

export default TimeSeriesProperties;
