import { mdiLink } from "@mdi/js";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomMapControl } from "./CustomMapControl";

toast.configure()

export class CustomShareControl extends CustomMapControl {
  constructor(){
    super(mdiLink, 
      "Get a link for the current map view to bookmark or share",
      () => {
      navigator.clipboard.writeText(window.location.href);
      toast.info("link copied successfully",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 500,
          theme: 'colored'
        });
    })
  }
}

