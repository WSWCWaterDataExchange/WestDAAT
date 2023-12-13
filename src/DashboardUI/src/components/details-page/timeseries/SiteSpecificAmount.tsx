import { Table } from "react-bootstrap";
import { ApiData } from "./ApiInterface";
import { Key, useState } from "react";
import "./time.scss";
import SortableHeader from "../../SortableHeader";
import React from "react";

interface TimeSeriesPropertiesProps {
  apiData: ApiData[] | null;
}

function SiteSpecificAmount({ apiData }: TimeSeriesPropertiesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const data = Object(apiData).Organizations[0].SiteVariableAmounts;

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  function formatDate(date: Date | string | number | null) {
    if (date instanceof Date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions;
      return date.toLocaleDateString(undefined, options);
    } else if (typeof date === 'string') {
      const parsedDate = new Date(date);
      
      if (!isNaN(parsedDate.getTime())) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions;
        return parsedDate.toLocaleDateString(undefined, options);
      }
    }
    return date;
  }

  // Sort the data based on the selected column and order
  const sortedData = data
    .slice()
    .sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      // Handle different data types
      if (valueA === valueB) return 0;

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="site-specific-amount">
      <div className="table-container">
        <Table striped bordered className="tab-results">
          <thead className="tbl-header">
            <tr className="tr-header">
              <SortableHeader
                label="WaterSourceUUID"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="AllocationGNISIDCV"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="TimeframeStart"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="TimeframeEnd"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="DataPublicationDate"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="AllocationCropDutyAmount"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="Amount"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="IrrigationMethodCV"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="IrrigatedAcreage"
                dataType="number"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="CropTypeCV"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="PopulationServed"
                dataType="number"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="PowerGeneratedGWh"
                dataType="number"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="AllocationCommunityWaterSupplySystem"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="SDWISIdentifier"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="DataPublicationDOI"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="ReportYearCV"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="MethodUUID"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="VariableSpecificUUID"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="SiteUUID"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="AssociatedNativeAllocationIDs"
                dataType="[]"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              <SortableHeader
                label="BeneficialUses"
                dataType="string"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </tr>
          </thead>
          <tbody>
            {displayItems().map(
              (
                item: {
                  WaterSourceUUID: string | number | null;
                  AllocationGNISIDCV: string | number | null;
                  TimeframeStart: Date | string | number | null;
                  TimeframeEnd: Date | string | number | null;
                  DataPublicationDate: Date | string | number | null;
                  AllocationCropDutyAmount: string | number | null;
                  Amount: string | number | null;
                  IrrigationMethodCV: string | number | null;
                  IrrigatedAcreage: string | number | null;
                  CropTypeCV: string | number | null;
                  PopulationServed: string | number | null;
                  PowerGeneratedGWh: string | number | null;
                  AllocationCommunityWaterSupplySystem: string | number | null;
                  SDWISIdentifier: string | number | null;
                  DataPublicationDOI: string | number | null;
                  ReportYearCV: string | number | null;
                  MethodUUID: string | number | null;
                  VariableSpecificUUID: string | number | null;
                  SiteUUID: string | number | null;
                  AssociatedNativeAllocationIDs: string | number | null;
                  BeneficialUses: string | number | null | [];
                },
                index: Key | null | undefined
              ) => (
                <tr key={index}>
                  <td>{item.WaterSourceUUID}</td>
                  <td>{item.AllocationGNISIDCV}</td>
                  <td>{formatDate(item.TimeframeStart)}</td>
                  <td>{formatDate(item.TimeframeEnd)}</td>
                  <td>{formatDate(item.DataPublicationDate)}</td>
                  <td>{item.AllocationCropDutyAmount}</td>
                  <td>{item.Amount}</td>
                  <td>{item.IrrigationMethodCV}</td>
                  <td>{item.IrrigatedAcreage}</td>
                  <td>{item.CropTypeCV}</td>
                  <td>{item.PopulationServed}</td>
                  <td>{item.PowerGeneratedGWh}</td>
                  <td>{item.AllocationCommunityWaterSupplySystem}</td>
                  <td>{item.SDWISIdentifier}</td>
                  <td>{item.DataPublicationDOI}</td>
                  <td>{item.ReportYearCV}</td>
                  <td>{item.MethodUUID}</td>
                  <td>{item.VariableSpecificUUID}</td>
                  <td>{item.SiteUUID}</td>
                  <td>{item.AssociatedNativeAllocationIDs}</td>
                  <td>{item.BeneficialUses}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>

      <div className="bottom-row">
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="page-buttons"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-buttons"
          >
            Previous
          </button>

          {/* Display the pages */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            // Calculate the maximum number of page buttons to display
            const maxPageButtons = 5;

            // Calculate the start and end page numbers to display
            const startPage = Math.min(
              Math.max(1, currentPage - Math.floor(maxPageButtons / 2)),
              totalPages - maxPageButtons + 1
            );
            const endPage = Math.min(
              startPage + maxPageButtons - 1,
              totalPages
            );

            // Conditionally render page buttons within the range
            if (pageNumber >= startPage && pageNumber <= endPage) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`page-buttons ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-buttons"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="page-buttons"
          >
            Last
          </button>
        </div>

      </div>
    </div>
  );
}
export default SiteSpecificAmount;
