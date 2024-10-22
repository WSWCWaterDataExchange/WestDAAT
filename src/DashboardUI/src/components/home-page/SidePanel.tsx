import React from 'react';
import './side-panel.scss';

function SidePanel(props: { children: JSX.Element }) {
  return <div className="side-panel d-flex flex-column">{props.children}</div>;
}

export default SidePanel;
