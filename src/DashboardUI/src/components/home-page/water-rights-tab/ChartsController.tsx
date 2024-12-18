import React from 'react';
import PieCharts from './PieCharts';
import Tab from 'react-bootstrap/esm/Tab';

interface ChartsControllerProps {
  activeTab: string;
  show: boolean;
}

function ChartsController(props: ChartsControllerProps) {
  if (!props.show) {
    return null;
  }

  switch (props.activeTab) {
    case 'pieChart': {
      return (
        <Tab.Pane eventKey="pieChart">
          <PieCharts />
        </Tab.Pane>
      );
    }
    default: {
      throw new Error('Invalid active tab ' + props.activeTab);
    }
  }
}

export default ChartsController;
