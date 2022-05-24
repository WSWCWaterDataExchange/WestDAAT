import { useState } from "react";
import { Button, Offcanvas, ProgressBar } from "react-bootstrap";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";

interface TableViewProps {
  containerRef: React.MutableRefObject<any>;
}

function TableView(props: TableViewProps) {
  const [show, setshow] = useState(false);

  const handleClose = () => setshow(false);
  const toggleShow = () => setshow((s: boolean) => !s);

  return <>
    <Button type="button" className={`table-view-toggle-btn ${show ? "toggle-on" : null}`} onClick={toggleShow}>
      ANALYTICS & TABLE
      <Icon path={show ? mdiChevronDown : mdiChevronUp} size="1.5em" />
    </Button>
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement={'bottom'}
      backdrop={false}
      scroll={true}
      container={props.containerRef}>
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