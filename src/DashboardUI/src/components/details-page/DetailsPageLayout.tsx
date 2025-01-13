import React, { PropsWithChildren, useMemo } from 'react';
import { useChildrenByTypes } from '../../hooks/useChildrenByTypes';

import './detail-page.scss';
import { EmptyPropsWithChildren } from '../../HelperTypes';

type DetailsPageFunctionType = {
  Header: typeof Header;
  Properties: typeof Properties;
  Map: typeof Map;
  Tabs: typeof Tabs;
  LineChart: typeof LineChart;
};

type DetailsPageComponent = React.FunctionComponent<EmptyPropsWithChildren> & DetailsPageFunctionType;

const DetailsPage: DetailsPageComponent = function DetailsPage({ children }: EmptyPropsWithChildren) {
  const { findChild: findHeader } = useChildrenByTypes('DetailsHeader');
  const header = useMemo(() => {
    return findHeader(children);
  }, [children, findHeader]);

  const { findChild: findProperties } = useChildrenByTypes('DetailsProperties');
  const properties = useMemo(() => {
    return findProperties(children);
  }, [children, findProperties]);

  const { findChild: findMap } = useChildrenByTypes('DetailsMap');
  const map = useMemo(() => {
    return findMap(children);
  }, [children, findMap]);

  const { findChild: findTabs } = useChildrenByTypes('DetailsTabs');
  const tabs = useMemo(() => {
    return findTabs(children);
  }, [children, findTabs]);

  const { findChild: findLineChart } = useChildrenByTypes('DetailsLineChart');
  const lineGraph = useMemo(() => {
    return findLineChart(children);
  }, [children, findLineChart]);

  return (
    <div className="detail-page d-flex flex-column flex-grow-1">
      <div className="row">
        <div className="col">{header}</div>
      </div>
      <div className="row properties-row">
        <div className="col-6">{properties}</div>
        <div className="col-6">{map}</div>
      </div>
      <div className="row mt-3">
        <div className="col">{tabs}</div>
      </div>
      <div className="row mt-3">
        <div className="col">{lineGraph}</div>
      </div>
    </div>
  );
};

type DetailsTypeProps = {
  children?: React.ReactNode;
};

const Header = function DetailsHeader({ children }: PropsWithChildren<DetailsTypeProps>) {
  return (
    <div className="d-flex flex-row align-items-center justify-content-center title-header">
      <h3 className="d-flex fw-bold">{children}</h3>
    </div>
  );
};
Header.displayName = 'DetailsHeader';

const Properties = function DetailsProperties({ children }: PropsWithChildren<DetailsTypeProps>) {
  return <>{children}</>;
};
Properties.displayName = 'DetailsProperties';

const Map = function DetailsMap({ children }: PropsWithChildren<DetailsTypeProps>) {
  return <>{children}</>;
};
Map.displayName = 'DetailsMap';

const Tabs = function DetailsTabs({ children }: PropsWithChildren<DetailsTypeProps>) {
  return <div className="flex-fill">{children}</div>;
};
Tabs.displayName = 'DetailsTabs';

const LineChart = function DetailsLineChart({ children }: PropsWithChildren<DetailsTypeProps>) {
  return <div className="flex-fill">{children}</div>;
};
LineChart.displayName = 'DetailsLineChart';

DetailsPage.Header = Header;
DetailsPage.Properties = Properties;
DetailsPage.Map = Map;
DetailsPage.Tabs = Tabs;
DetailsPage.LineChart = LineChart;

export { DetailsPage };
