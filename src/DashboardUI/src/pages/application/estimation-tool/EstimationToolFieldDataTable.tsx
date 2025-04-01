import Table from 'react-bootstrap/esm/Table';
import { formatNumber } from '../../../utilities/valueFormatters';
import { PolygonEtDataCollection } from '../../../data-contracts/PolygonEtDataCollection';
import Card from 'react-bootstrap/esm/Card';

interface EstimationToolFieldDataTableProps {
  data: Partial<PolygonEtDataCollection>;
  fieldAcreage: number;
}

function EstimationToolFieldDataTable(props: EstimationToolFieldDataTableProps) {
  const convertFieldEtInInchesToAcreFeet = (etInInches: number) => (etInInches / 12) * props.fieldAcreage;

  const renderCard = (value: number | undefined, title: string, units: string) => (
    <Card className="flex-grow-1 rounded-3 shadow-sm col-xxl-2 col-lg-3 col-4">
      <Card.Body>
        <Card.Title className="mt-3 fs-3 text-center fw-bold">{formatNumber(value, 2)}</Card.Title>
        <Card.Text className="text-center fw-bold fs-6">
          {title} ({units})
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <div className="d-flex justify-content-around gap-3 mb-3">
        {renderCard(props.fieldAcreage, 'Field Area', 'acres')}
        {renderCard(props.data?.averageYearlyTotalEtInInches, 'Average Yearly ET', 'inches')}
        {renderCard(props.data?.averageYearlyTotalEtInAcreFeet, 'Average Yearly ET', 'acre-feet')}
      </div>

      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Total ET (inches)</th>
            <th>Total ET (acre-feet)</th>
          </tr>
        </thead>
        <tbody>
          {(props.data.datapoints ?? []).map((item) => (
            <tr key={item.year}>
              <td>{item.year}</td>
              <td>{formatNumber(item.totalEtInInches, 2)}</td>
              <td>{formatNumber(convertFieldEtInInchesToAcreFeet(item.totalEtInInches), 2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default EstimationToolFieldDataTable;
