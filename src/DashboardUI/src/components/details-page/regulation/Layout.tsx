import { DetailsPage } from "../DetailsPageLayout";
import RegulationProperties from "./RegulationProperties";
import RegulationTabs from "./RegulationTabs";

//import { useAlerts } from "./hooks/useAlerts";

import "./regulation.scss";
import RegulationMap from "./RegulationMap";

export function Layout() {
  // useAlerts(); // TODO: Wire up / for the popup alerts for loading/errors
  return (
    <DetailsPage>
      <DetailsPage.Header>Overlay Landing Page</DetailsPage.Header>
      <DetailsPage.Properties>
        <RegulationProperties />
      </DetailsPage.Properties>
      <DetailsPage.Map>
        <RegulationMap />
      </DetailsPage.Map>
      <DetailsPage.Tabs>
        <RegulationTabs />
      </DetailsPage.Tabs>
    </DetailsPage>
  );
}
