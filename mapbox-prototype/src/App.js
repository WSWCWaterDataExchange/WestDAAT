import React from 'react';
import AllocationMap from './AllocationMap';
import AggregationMap from './AggregationMap';
import { Tabs, Tab } from 'react-bootstrap-tabs';

function App() {
  return (
    <div>
      <div className="jumbotron jumbotron-fluid p-4">
        <h1 className="display-4 text-center">Western States Water Rights Data Application</h1>
        <br />
        <p className="lead">Water Data Exchange (WaDE) Program, Western States Water Council</p>
        <p className="lead"><b>Contact: </b>Adel Abdallah, Program Manager, <a href="mailto:adelabdallah@wswc.utah.gov">adelabdallah@wswc.utah.gov</a></p>
        <p className="lead danger"><b>DISCLAIMER:</b> This application is under construction, not for public use, and has not yet been fully approved by our member states. Individual states have unique water rights administration systems. Please check metadata before making any comparisons. The purpose of WaDE is to support regional water data and availability analysis. This data is not meant for localized decisions. Before drawing any conclusions or making comparisons, please consult the state's water rights agency and their used methods. Please also consult with the WaDE team before using this tool. We look forward to hear your feedback.</p>
      </div>
      <Tabs>
        <Tab label="Allocations">
          <AllocationMap />
        </Tab>
        <Tab label="Aggregations">
          <AggregationMap />
        </Tab>
      </Tabs>
    </div >
  );
}

export default App;
