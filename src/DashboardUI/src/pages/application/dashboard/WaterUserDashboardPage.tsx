import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function WaterUserDashboardPage() {
  const applicationContext = useConservationApplicationContext();

  return (
    <div>
      <h1>Water User Dashboard</h1>
      <pre>{JSON.stringify(applicationContext.state, null, 2)}</pre>
    </div>
  );
}
