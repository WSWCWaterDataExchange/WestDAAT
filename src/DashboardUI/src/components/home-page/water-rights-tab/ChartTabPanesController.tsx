import React from 'react';
import PieCharts from './PieCharts';
import Tab from 'react-bootstrap/esm/Tab';

interface ChartTabPanesControllerProps {
  activeTab: string;
  show: boolean;
}

function ChartTabPanesController(props: ChartTabPanesControllerProps) {
  return <Tab.Pane eventKey="pieChart">{props.activeTab === 'pieChart' && props.show && <PieCharts />}</Tab.Pane>;
}

export default ChartTabPanesController;
