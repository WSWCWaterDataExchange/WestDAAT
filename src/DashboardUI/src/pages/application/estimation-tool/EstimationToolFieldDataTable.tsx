import Table from 'react-bootstrap/esm/Table';
import { PolygonEtDatapoint } from '../../../data-contracts/PolygonEtDatapoint';

interface EstimationToolFieldDataTableProps {
  fieldAcreage: number;
  datapoints: PolygonEtDatapoint[];
}

function EstimationToolFieldDataTable(props: EstimationToolFieldDataTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Total Area</th>
          <th>Total ET</th>
        </tr>
      </thead>
      <tbody>
        {props.datapoints.map((item) => (
          <tr key={item.year}>
            <td>{item.year}</td>
            <td>{props.fieldAcreage}</td>
            <td>{item.etInInches}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default EstimationToolFieldDataTable;
