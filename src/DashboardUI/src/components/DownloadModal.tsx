import { useEffect, useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { AppContext } from '../AppProvider';
import { SignIn } from "./SignIn";
import '../styles/home-page.scss';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import moment from 'moment';
import { FilterContext } from '../FilterProvider';
import { downloadWaterRights } from '../accessors/waterAllocationAccessor';
import { ProgressBar } from 'react-bootstrap';
import { useWaterRightsDownload } from '../hooks';

interface DownloadModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

function DownloadModal(props: DownloadModalProps) {
  const { isAuthenticated } = useContext(AppContext).authenticationContext;
  const { filters } = useContext(FilterContext);

  const [ searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);

  const { isFetching, isError } = useWaterRightsDownload(searchCriteria);

  const close = () => {
    props.setShow(false);
  }
  const download = async () => 
  {
    if (searchCriteria !== null){
      searchCriteria.filterUrl = window.location.href;
      downloadWaterRights(searchCriteria);

      if (isError === false){
        props.setShow(false);
      }
    }
  }

  useEffect(() => {
    setSearchCriteria({
      beneficialUses: filters.beneficialUses?.map(b => b.beneficialUseName),
      filterGeometry: filters.polyline.map(p => JSON.stringify(p.data.geometry)),
      expemptofVolumeFlowPriority: filters.includeExempt,
      minimumFlow: filters.minFlow,
      maximumFlow: filters.maxFlow,
      minimumVolume: filters.minVolume,
      maximumVolume: filters.maxVolume,
      podOrPou: filters.podPou,
      minimumPriorityDate: filters.minPriorityDate ? moment.unix(filters.minPriorityDate).toDate() : undefined,
      maximumPriorityDate: filters.maxPriorityDate ? moment.unix(filters.maxPriorityDate).toDate() : undefined,
      ownerClassifications: filters.ownerClassifications,
      waterSourceTypes: filters.waterSourceTypes,
      riverBasinNames: filters.riverBasinNames,
      allocationOwner: filters.allocationOwner,
      states: filters.states
    });
  }, [filters, setSearchCriteria]);

  return (
    <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
        { !isAuthenticated && <label>Login for Download Access</label> }
        { isAuthenticated && <label>Download</label> }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      { !isAuthenticated && <p>
          Sign up <strong>completely free</strong> or login for download access of up to 100,000
          water rights points.
        </p>}
        {/* display error if more than 100k records */}
        { isError && <p> Something went wrong, please try again with a different query paramenter</p>} 
        {/* display donwload message to continue with download if user is authenticated */}
        { isAuthenticated && !isFetching && <p>Download access limited up to a maximum of 100,000 water rights points. Click Download to continue</p>}
        {/* display modal with is fetching info and progress bar with it */}
        { isAuthenticated && isFetching && <p>We are preparing your download, this might take some time
                <ProgressBar animated now={100} />
            </p>
            }
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-between'}}>
      <Button className="btn btn-secondary" onClick={close}>Cancel</Button>
      {!isAuthenticated && <Button className="sign-in-button" ><SignIn /></Button>}
      {isAuthenticated && <Button onClick={download}>Download</Button>}
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadModal;
