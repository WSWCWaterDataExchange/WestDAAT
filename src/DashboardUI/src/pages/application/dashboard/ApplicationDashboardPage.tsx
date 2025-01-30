import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function ApplicationDashboardPage() {
  const applicationContext = useConservationApplicationContext();

  return (
    <div>
      <h1>Application Dashboard</h1>
      <pre>{JSON.stringify(applicationContext.state, null, 2)}</pre>
    </div>
  );
}
