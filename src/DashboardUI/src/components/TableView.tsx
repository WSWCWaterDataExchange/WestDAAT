import { useState } from "react";
import { Button, Offcanvas, ProgressBar } from "react-bootstrap";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import "../styles/tableView.scss";
import Icon from "@mdi/react";
import { useFindWaterRights } from "../hooks/useWaterRightQuery";

interface TableViewProps {
  containerRef: React.MutableRefObject<any>;
}

function TableView(props: TableViewProps) {
  const [show, setshow] = useState(false);

  const handleClose = () => setshow(false);
  const toggleShow = () => setshow((s: boolean) => !s);

  const { data: waterRightsSearchResults, isFetching } = useFindWaterRights({ pageNumber: 0 })

  const loadingView =
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Loading filter data</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ProgressBar animated now={100} />
      </Offcanvas.Body>
    </>;

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
      {isFetching ? loadingView : JSON.stringify(waterRightsSearchResults)}
    </Offcanvas>
  </>
}

export default TableView;