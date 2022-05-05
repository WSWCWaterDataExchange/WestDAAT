import { mdiLink } from "@mdi/js";
import Icon from "@mdi/react";
import mapboxgl from "mapbox-gl";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/map.scss";

toast.configure()

const iconElement = () => {
  return <div><Icon path={mdiLink}></Icon></div>
}

export class CustomShareControl{
  public mapInstance: mapboxgl.Map;

  constructor(map: mapboxgl.Map){
    this.mapInstance = map;
  }
  onAdd(map: mapboxgl.Map) {

    const path = document.createElement("path");
    path.setAttribute("d", mdiLink)
    path.setAttribute("style", "fill: #000000")

    const svg = document.createElement("svg");
    svg.setAttribute("viewbox", "0 0 24 24");
    svg.setAttribute("role", "img");
    svg.setAttribute("style", "width: 40px; height: 40px;")
    svg.appendChild(path);

    const btn = document.createElement("button");
    btn.className = "mapboxgl-ctrl-icon";
    btn.onclick = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.info("link copied successfully",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 500
        });
    };

    btn.appendChild(svg);
    
    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    container.appendChild(btn);

    return container;
  }

  onRemove(map: mapboxgl.Map) {
    return;
  }
}
