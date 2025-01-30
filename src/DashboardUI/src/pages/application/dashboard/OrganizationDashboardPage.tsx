import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function OrganizationDashboardPage() {
  const applicationContext = useConservationApplicationContext();

  return (
    <div>
      <NotImplementedPlaceholder />
      <h1>Organization Dashboard</h1>
      <pre>{JSON.stringify(applicationContext.state, null, 2)}</pre>
    </div>
  );
}
