import Table from 'react-bootstrap/esm/Table';
import { formatNumber } from '../../../utilities/valueFormatters';
import { PolygonEtDataCollection } from '../../../data-contracts/PolygonEtDataCollection';
import Card from 'react-bootstrap/esm/Card';

interface EstimationToolFieldDataTableProps {
  data: Partial<PolygonEtDataCollection>;
  fieldAcreage: number;
}

function EstimationToolFieldDataTable(props: EstimationToolFieldDataTableProps) {
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
        {renderCard(props.data?.averageYearlyTotalEtInInches, 'Average Yearly Total ET', 'inches')}
        {renderCard(props.data?.averageYearlyNetEtInInches ?? undefined, 'Average Yearly Net ET', 'inches')}
      </div>

      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Total ET (inches)</th>
            <th>Net ET (inches)</th>
          </tr>
        </thead>
        <tbody>
          {(props.data.datapoints ?? []).map((item) => (
            <tr key={item.year}>
              <td>{item.year}</td>
              <td>{formatNumber(item.totalEtInInches, 2)}</td>
              <td>{formatNumber(item.netEtInInches, 2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default EstimationToolFieldDataTable;
