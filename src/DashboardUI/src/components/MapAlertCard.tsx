import React from 'react';
import { ReactChild } from "react";
import { Card, CardProps } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

import '../styles/no-map-results.scss'

export interface MapPopupCardProps {
  children: {
    header?: ReactChild,
    body?: ReactChild
  },
  onClosePopup: () => void,
  cardProps?: CardProps
}
export function MapAlertCard(props: MapPopupCardProps) {
  return (
    <div className="no-map-results-alert">
      <Card {...props.cardProps}>
        <CardHeader>
          <div className="d-flex justify-content-between flex-nowrap">
            {props.children.header}
            <button type="button" onClick={props.onClosePopup} className="btn-close map-popup-close-btn"></button>
          </div>
        </CardHeader>
        <div className="card-body">
          {props.children.body}
        </div>
      </Card>
    </div>
  );
}
