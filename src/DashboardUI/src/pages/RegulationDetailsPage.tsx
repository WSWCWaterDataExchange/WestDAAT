import { Layout } from '../components/details-page/regulation/Layout';
import {RegulationDetailsProvider} from "../components/details-page/regulation/Provider";

function RegulationDetailsPage() {
  return (
    <RegulationDetailsProvider>
      <Layout />
    </RegulationDetailsProvider>
  )
}

export default RegulationDetailsPage;
