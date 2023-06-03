import React, { PropsWithChildren, useMemo } from 'react';
import { useChildrenByTypes } from '../../hooks/useChildrenByTypes';

import './detail-page.scss'

type DetailsPageFunctionType = { 
  Header: React.FunctionComponent,
  Properties: React.FunctionComponent,
  Map: React.FunctionComponent,
  Tabs: React.FunctionComponent
}

type DetailsPageComponent = React.FunctionComponent<PropsWithChildren<{}>> & DetailsPageFunctionType;
const DetailsPage: DetailsPageComponent = function DetailsPage({children}: PropsWithChildren<{}>) {
  const {findChild: findHeader} = useChildrenByTypes('DetailsHeader')
  const header = useMemo(() =>{
    return findHeader(children)
  }, [children, findHeader])

  const {findChild: findProperties} = useChildrenByTypes('DetailsProperties')
  const properties = useMemo(() =>{
    return findProperties(children)
  }, [children, findProperties])

  const {findChild: findMap} = useChildrenByTypes('DetailsMap')
  const map = useMemo(() =>{
    return findMap(children)
  }, [children, findMap])

  const {findChild: findTabs} = useChildrenByTypes('DetailsTabs')
  const tabs = useMemo(() =>{
    return findTabs(children)
  }, [children, findTabs])

  return (
    <div className="detail-page d-flex flex-column flex-grow-1">
      <div className='row'>
        <div className='col'>
          {header}
        </div>
      </div>
      <div className='row properties-row'>
        <div className='col-7'>
          {properties}
        </div>
        <div className='col-5'>
          {map}
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          {tabs}
        </div>
      </div>
    </div>
  );
};

const Header = function DetailsHeader({children}: PropsWithChildren<{}>){
  return (
    <div className='d-flex flex-row align-items-center justify-content-center title-header'>
      <h3 className='d-flex fw-bold'>{children}</h3>
    </div>
  )
};

const Properties = function DetailsProperties({children}: PropsWithChildren<{}>){
  return <>{children}</>;
};

const Map = function DetailsMap({children}: PropsWithChildren<{}>){
  return <>{children}</>
};

const Tabs = function DetailsTabs({children}: PropsWithChildren<{}>){
  return (
    <div className='flex-fill'>
      {children}
    </div>
  )
};

DetailsPage.Header = Header;
DetailsPage.Properties = Properties;
DetailsPage.Map = Map;
DetailsPage.Tabs = Tabs;

export { DetailsPage };