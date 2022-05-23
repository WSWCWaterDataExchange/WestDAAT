import { useState } from "react";
import { Button, Offcanvas, ProgressBar } from "react-bootstrap";
import { mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";
//import BootstrapModalManager from './BootstrapModalManager';

function TableView() {
  const [show, setshow] = useState(true);

  const handleClose = () => setshow(false);
  const toggleShow = () => setshow((s:boolean) => !s);

  //const modalManager = new BootstrapModalManager

  return <>
    <Button type="button" className="buttonTest ms-1" onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={mdiChevronUp} size="1.5em" />
    </Button>
    {/* <button type="button" className="buttonTest ms-1">Analytics Table</button> */}
    <Offcanvas show={show} onHide={handleClose} placement={'bottom'} backdrop={false} scroll={true}>
    <Button type="button" className="buttonTest ms-1" onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={mdiChevronUp} size="1.5em" />
    </Button>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Loading filter data</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ProgressBar animated now={100} />
        </Offcanvas.Body>
      </Offcanvas>
  </>
}

export default TableView;