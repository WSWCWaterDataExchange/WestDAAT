import React, { JSX } from 'react';
function MainPanel(props: { children: JSX.Element | JSX.Element[] }) {
  return <div className="d-flex flex-column flex-fill">{props.children}</div>;
}

export default MainPanel;
