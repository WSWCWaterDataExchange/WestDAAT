import Table from 'react-bootstrap/esm/Table';
import { PolygonEtDatapoint } from '../../../data-contracts/PolygonEtDatapoint';
import { formatNumber } from '../../../utilities/valueFormatters';

interface EstimationToolFieldDataTableProps {
  datapoints: PolygonEtDatapoint[];
}

function EstimationToolFieldDataTable(props: EstimationToolFieldDataTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Total ET (inches)</th>
        </tr>
      </thead>
      <tbody>
        {props.datapoints.map((item) => (
          <tr key={item.year}>
            <td>{item.year}</td>
            <td>{formatNumber(item.etInInches, 2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default EstimationToolFieldDataTable;
