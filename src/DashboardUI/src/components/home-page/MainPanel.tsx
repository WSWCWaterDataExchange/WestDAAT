import React from 'react';

function MainPanel(props: { children: JSX.Element | JSX.Element[] }) {
  return <div className="flex-grow-1 position-relative">{props.children}</div>;
}

export default MainPanel;
