import MapTheme from '../../../components/home-page/water-rights-tab/map-options/components/MapTheme';

export function EstimationToolSidebar() {
  const acreageSum = 0;
  return (
    <div className="flex-grow-1 panel-content">
      <div className="container-fluid">
        <SidebarElement title="CALCULATED SHAPE AREA FOR ALL IRRIGATED FIELDS">
          <div>
            <span className="fs-5 fw-bold text-primary">{acreageSum} Acres</span>
          </div>

          <div>
            <span className="text-muted">Note: Polygons must be smaller than 50,000 acres.</span>
          </div>
        </SidebarElement>

        <SidebarElement title="FUNDING ORGANIZATION">placeholder</SidebarElement>

        <SidebarElement title="OpenET Model">placeholder</SidebarElement>

        <MapTheme />

        <SidebarElement title="ESTIMATED CONSUMPTIVE USE">placeholder</SidebarElement>

        <SidebarElement title="AVERAGE HISTORICAL TOTAL CONSUMPTIVE USE (DEPLETION)">placeholder</SidebarElement>

        <SidebarElement title="CONSERVATION ORGANIZATION COMPENSATION RATE">placeholder</SidebarElement>

        <SidebarElement title="DESIRED COMPENSATION">placeholder</SidebarElement>

        <SidebarElement title="CONSERVATION ESTIMATE">placeholder</SidebarElement>
      </div>
    </div>
  );
}

interface SidebarElementProps {
  title: string;
  tooltip?: string;
  children?: React.ReactNode;
}

function SidebarElement(props: SidebarElementProps) {
  return (
    <div className="sidebar-element mb-4">
      <div>
        <span className="fs-5 fw-bold">{props.title}</span>
      </div>
      <div>{props.children}</div>
    </div>
  );
}
