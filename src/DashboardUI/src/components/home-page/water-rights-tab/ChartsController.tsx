import React from 'react';
import PieCharts from './PieCharts';
import Tab from 'react-bootstrap/esm/Tab';
import { useGetAnalyticsSummaryInfo } from '../../../hooks/queries';
import { useWaterRightsSearchCriteria } from './hooks/useWaterRightsSearchCriteria';

interface ChartsControllerProps {
  activeTab: string;
  show: boolean;
}

function ChartsController(props: ChartsControllerProps) {
  const { searchCriteria } = useWaterRightsSearchCriteria();
  const { data: pieChartSearchResults, isFetching } = useGetAnalyticsSummaryInfo(searchCriteria);

  if (!props.show) {
    return null;
  }

  switch (props.activeTab) {
    case 'pieChart': {
      return (
        <Tab.Pane eventKey="pieChart">
          <PieCharts pieChartSearchResults={pieChartSearchResults} isFetching={isFetching} />
        </Tab.Pane>
      );
    }
    default: {
      throw new Error('Invalid active tab ' + props.activeTab);
    }
  }
}

export default ChartsController;
