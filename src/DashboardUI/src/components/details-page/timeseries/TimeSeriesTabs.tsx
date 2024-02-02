import { Tab, Table, Tabs } from "react-bootstrap";
import { ApiData } from "./ApiInterface";
import { Key, useEffect, useState } from "react";
import Chart from "./Chart";
import "./time.scss";
import SiteSpecificAmount from "./SiteSpecificAmount";
import SortableHeader from "../../SortableHeader";
import Downloads from "./Downloads";

interface TimeSeriesPropertiesProps {
  apiData: ApiData[] | null;
}

function TimeSeriesTabs({ apiData }: TimeSeriesPropertiesProps) {
  const [activeTab, setActiveTab] = useState<string>("variable");

  let variableSpecificObjects;
  let waterSourceObjects;
  let waterRightObjects;

  let apiToView = "";
  useEffect(() => {
    setActiveTab("variable");
  }, [apiData]);

  if (Object(apiData) !== null && Object(apiData).TotalSiteVariableAmountsCount !== undefined) {
    if (Object(apiData).TotalSiteVariableAmountsCount !== 0) {
      apiToView = `https://wade-api-uat.azure-api.net/v1/SiteVariableAmounts?SiteUUID=${Object(apiData).Organizations[0].Sites[0].SiteUUID}&key=38f422d1ada34907a91aff4532fa4669`;
      variableSpecificObjects = Object(apiData).Organizations[0].VariableSpecifics;
      waterSourceObjects = Object(apiData).Organizations[0].WaterSources;
      waterRightObjects = Object(apiData).Organizations[0].SiteVariableAmounts;
    }
  }

  const [currentPage] = useState(1);
  const itemsPerPage = 10;
  var data = variableSpecificObjects;

  if (activeTab === "variable") {
    data = variableSpecificObjects;
  } else if (activeTab === "source") {
    data = waterSourceObjects;
  } else if (activeTab === "right") {
    data = waterRightObjects;
  }

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  const sortedData = data
    ? data.slice().sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        // Handle different data types
        if (valueA === valueB) return 0;

        if (sortOrder === "asc") {
          return valueA < valueB ? -1 : 1;
        } else {
          return valueA > valueB ? -1 : 1;
        }
      })
    : [];

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  return (
    <div className="tabs-chart">
      {Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div className="download-button">
          <Downloads apiData={apiData} />
        </div>
      ) : (
        <div></div>
      )}

      <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key as string)} className="table-light">
        <Tab eventKey="variable" title="Variable Specifics Info" />
        <Tab eventKey="specific" title="Site Specific Amount Info" />
        <Tab eventKey="source" title="Water Source Info" />
        <Tab eventKey="right" title="Water Right Information" />
      </Tabs>

      {/* conditionally renders table based on what is clicked */}
      {activeTab === "variable" && Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div>
          <div className="table-container">
            <Table striped bordered className="tab-results">
              <thead className="tbl-header">
                <tr className="tr-header">
                  <SortableHeader label="VariableSpecificUUID" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="VariableSpecificTypeCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="VariableCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="AmountUnitCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="AggregationStatisticsCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="AggregationInterval" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="AggregationIntervalUnitCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="ReportYearStartMonth" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="ReportYearType" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="MaximumAmountUnitCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                </tr>
              </thead>
              <tbody>
                {displayItems().map(
                  (
                    item: {
                      VariableSpecificUUID: string | number | null;
                      VariableSpecificTypeCV: string | number | null;
                      VariableCV: string | number | null;
                      AmountUnitCV: string | number | null;
                      AggregationStatisticCV: string | number | null;
                      AggregationInterval: string | number | null;
                      AggregationIntervalUnitCV: string | number | null;
                      ReportYearStartMonth: string | number | null;
                      ReportYearTypeCV: string | number | null;
                      MaximumAmountUnitCV: string | number | null;
                    },
                    index: Key | null | undefined
                  ) => (
                    <tr key={index}>
                      <td>{item.VariableSpecificUUID}</td>
                      <td>{item.VariableSpecificTypeCV}</td>
                      <td>{item.VariableCV}</td>
                      <td>{item.AmountUnitCV}</td>
                      <td>{item.AggregationStatisticCV}</td>
                      <td>{item.AggregationInterval}</td>
                      <td>{item.AggregationIntervalUnitCV}</td>
                      <td>{item.ReportYearStartMonth}</td>
                      <td>{item.ReportYearTypeCV}</td>
                      <td>{item.MaximumAmountUnitCV}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
          <div>
            <Chart apiData={apiData} />
          </div>
        </div>
      ) : activeTab === "specific" && Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div>
          <SiteSpecificAmount apiData={apiData} />
        </div>
      ) : activeTab === "source" && Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div>
          <div>
            <Table striped bordered className="tab-results">
              <thead className="tbl-header">
                <tr className="tr-header">
                  <SortableHeader label="WaterSourceName" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="WaterSourceNativeID" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="WaterSourceUUID" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="WaterSourceTypeCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="FreshSalineIndicatorCV" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                  <SortableHeader label="WaterSourceGeometry" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                </tr>
              </thead>
              <tbody>
                {displayItems().map(
                  (
                    item: {
                      WaterSourceName: string | number | null;
                      WaterSourceNativeID: string | number | null;
                      WaterSourceUUID: string | number | null;
                      WaterSourceTypeCV: string | number | null;
                      FreshSalineIndicatorCV: string | number | null;
                      WaterSourceGeometry: string | number | null;
                    },
                    index: Key | null | undefined
                  ) => (
                    <tr key={index}>
                      <td>{item.WaterSourceName}</td>
                      <td>{item.WaterSourceNativeID}</td>
                      <td>{item.WaterSourceUUID}</td>
                      <td>{item.WaterSourceTypeCV}</td>
                      <td>{item.FreshSalineIndicatorCV}</td>
                      <td>{item.WaterSourceGeometry}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
          <div>
            <Chart apiData={apiData} />
          </div>
        </div>
      ) : activeTab === "right" && Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div>
          <div className="table-container">
            <Table striped bordered className="tab-results">
              <thead className="tbl-header">
                <tr className="tr-header">
                  <SortableHeader label="Water Right Native ID" dataType="string" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a target="_blank" href={`https://westdaat.westernstateswater.org/details/site/${Object(apiData).Organizations[0].Sites[0].SiteUUID}`} rel="noopener noreferrer">
                      {Object(apiData).Organizations[0].SiteVariableAmounts[0].AssociatedNativeAllocationIDs}{" "}
                    </a>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div>
            <Chart apiData={apiData} />
          </div>
        </div>
      ) : (
        <div>
          <p>No API data available for this tab.</p>
        </div>
      )}
      {Object(apiData).TotalSiteVariableAmountsCount > 0 ? (
        <div className="api-link">
          <a href={`${apiToView}`} target="_blank">
            View API
          </a>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default TimeSeriesTabs;
