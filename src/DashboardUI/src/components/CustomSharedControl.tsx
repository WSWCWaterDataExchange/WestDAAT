import { mdiLink } from "@mdi/js";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/map.scss";

toast.configure()

export class CustomShareControl{
  onAdd() {
    const path = document.createElement("path");
    path.setAttribute("d", mdiLink)
    path.setAttribute("style", "fill: #000000")

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class","shareElement");
    svg.setAttribute("viewbox", "0 0 24 24");
    svg.setAttribute("style", "width: 25px; height: 25px;")
    svg.appendChild(path);

    const btn = document.createElement("button");
    btn.className = "mapboxgl-ctrl-icon";
    
    btn.onclick = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.info("link copied successfully",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 500,
          theme: 'colored'
        });
    };

    btn.appendChild(svg);

    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl mapboxgl-ctrl-group containerElement";
    container.setAttribute("data-title", "Get a link for the current map view to bookmark or share");
    container.appendChild(btn);

    return container;
  }

  onRemove() {
    return;
  }
}
