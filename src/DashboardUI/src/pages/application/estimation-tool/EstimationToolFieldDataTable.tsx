import Table from 'react-bootstrap/esm/Table';
import { formatNumber } from '../../../utilities/valueFormatters';
import { PolygonEtDataCollection } from '../../../data-contracts/PolygonEtDataCollection';

interface EstimationToolFieldDataTableProps {
  data: PolygonEtDataCollection;
  fieldAcreage: number;
}

function EstimationToolFieldDataTable(props: EstimationToolFieldDataTableProps) {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Field Area (acres)</th>
            <th>Average Yearly ET (inches)</th>
            <th>Average Yearly ET (acre-feet)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatNumber(props.fieldAcreage, 2)}</td>
            <td>{formatNumber(props.data.averageYearlyEtInInches, 2)}</td>
            <td>{formatNumber(props.data.averageYearlyEtInAcreFeet, 2)}</td>
          </tr>
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <th colSpan={2}>Yearly Evapotranspiration Data</th>
          </tr>
          <tr>
            <th>Year</th>
            <th>Total ET (inches)</th>
          </tr>
        </thead>
        <tbody>
          {props.data.datapoints.map((item) => (
            <tr key={item.year}>
              <td>{item.year}</td>
              <td>{formatNumber(item.etInInches, 2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default EstimationToolFieldDataTable;
