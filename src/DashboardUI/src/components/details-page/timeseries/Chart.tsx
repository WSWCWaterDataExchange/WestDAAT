import HighchartsReact from "highcharts-react-official";
import Highcharts, { chart } from "highcharts";
import { ApiData } from "./ApiInterface";
import React, { useState, useEffect } from "react";
import "./time.scss";

interface ChartProps {
  apiData: ApiData[] | null;
}
let siteVariableAmounts;
let chartData: any;
let filteredData;
let variableSpecificUUIDS: string[] = [];
let filteredByVariableUUID: any[] = [];

function Chart({ apiData }: ChartProps) {
  const [selectedUUID, setSelectedUUID] = useState(variableSpecificUUIDS[0]);
  useEffect(() => {
    if (
      Object(apiData) !== null &&
      Object(apiData).TotalSiteVariableAmountsCount !== undefined
    ) {
      const firstUUID =
        Object(apiData).Organizations[0].VariableSpecifics[0]
          .VariableSpecificUUID;
      setSelectedUUID(firstUUID);
    }
  }, [apiData]);

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedUUID(event.target.value);
  };

  if (
    Object(apiData) !== null &&
    Object(apiData).TotalSiteVariableAmountsCount !== undefined
  ) {
    if (Object(apiData).TotalSiteVariableAmountsCount !== 0) {
      filteredByVariableUUID.length = 0;
      variableSpecificUUIDS.length = 0;

      for (
        var i = 0;
        i < Object(apiData).Organizations[0].VariableSpecifics.length;
        i++
      ) {
        variableSpecificUUIDS.push(
          Object(apiData).Organizations[0].VariableSpecifics[i]
            .VariableSpecificUUID
        );
      }
      siteVariableAmounts =
        Object(apiData).Organizations[0].SiteVariableAmounts || [];

      for (
        var i = 0;
        i < Object(apiData).Organizations[0].SiteVariableAmounts.length;
        i++
      ) {
        if (
          Object(apiData).Organizations[0].SiteVariableAmounts[i]
            .VariableSpecificUUID === selectedUUID
        ) {
          filteredByVariableUUID.push(
            Object(apiData).Organizations[0].SiteVariableAmounts[i]
          );
        }
      }

      // Filter out items without valid TimeframeStart and Amount values
      filteredData = filteredByVariableUUID.filter(
        (item: { TimeframeStart: string; Amount: number }) =>
          item.TimeframeStart && item.Amount
      );

      // Sort the filtered data by TimeframeStart in ascending order
      filteredData.sort(
        (a: { TimeframeStart: string }, b: { TimeframeStart: string }) =>
          new Date(a.TimeframeStart).getTime() -
          new Date(b.TimeframeStart).getTime()
      );

      chartData = filteredData.map(
        (item: { TimeframeStart: string; Amount: number }) => ({
          x: new Date(item.TimeframeStart).getTime(),
          y: item.Amount,
        })
      );
    }
  }

  const options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      zoomType: "x",
    },
    title: {
      text: "Site Specific Water Use by Variable Specific Type",
      align: "left",
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? "Click and drag in the plot area to zoom in"
          : "Pinch the chart to zoom in",
      align: "left",
    },
    xAxis: {
      title: {
        text: "Report Time",
        style: {
          fontSize: "15px",
          fontWeight: "bold",
        },
      },
      type: "datetime",
    },
    yAxis: {
      title: {
        text:
          "Sum of Water Amount Per: " +
          Object(apiData).Organizations[0].VariableSpecifics[0].AmountUnitCV,
        style: {
          fontSize: "15px",
          fontWeight: "bold",
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: 0,
      y: 30,
      floating: true,
      borderWidth: 1,
      backgroundColor: "#e1ecf4",

      shadow: true,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors?.[0] || "#000000"], // Using optional chaining and a fallback value
            [
              1,
              (
                Highcharts.color(
                  Highcharts.getOptions().colors?.[0] || "#000000"
                ) as any
              )
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: 0,
      },
    },
    series: [
      {
        type: "area",
        name:
          "Amount Used Per: " +
          Object(apiData).Organizations[0].VariableSpecifics[0].AmountUnitCV,
        data: chartData,
        grouping: false,
        allowPointSelect: true,
      },
    ],
  };

  return (
    <div>
      <div>
        <select
          className="dropdown"
          value={selectedUUID}
          onChange={handleDropdownChange}
        >
          {variableSpecificUUIDS.map((uuid) => (
            <option key={uuid} value={uuid}>
              {uuid}
            </option>
          ))}
        </select>
      </div>
      <div className="charting ">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
export default Chart;
