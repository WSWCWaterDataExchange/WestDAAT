import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { AppContext } from '../AppProvider';
import { SignIn } from "./SignIn";
import '../styles/home-page.scss';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import { FilterContext } from '../FilterProvider';
import { ProgressBar } from 'react-bootstrap';
import { useWaterRightsDownload } from '../hooks';

interface DownloadModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

function DownloadWaterRights(props: {
  searchCriteria: WaterRightsSearchCriteria | null,
  setIsError:(isError: boolean) => void,
  setIsFetching: (isFetching: boolean) => void,
  setIsFetched: (isFetched: boolean) => void,
  setIsDownloadLimitError: (isFetched: boolean) => void}){

  const {isFetching, isError, isFetched, error} =  useWaterRightsDownload(props.searchCriteria);
  const { setIsError } = props;
  const { setIsFetching } = props;
  const { setIsFetched } = props;
  const { setIsDownloadLimitError } = props;

  useEffect(() => {
    if (isError){
      setIsError(isError);
      if(error instanceof Error){
        setIsDownloadLimitError(error.message === 'Download limit exceeded.');
      }
    }
  }, [isError, error, setIsError, setIsDownloadLimitError]);

  useEffect(() => {
    if (!isFetching){
      setIsFetching(isFetching);
    }
  }, [isFetching, setIsFetching]);

  useEffect(() => {
    if (isFetched){
      setIsFetched(isFetched);
    }
  }, [isFetched, setIsFetched]);

  return (<div><p>We are preparing your download, this might take some time
                </p>
                <ProgressBar animated now={100} /></div>
                );
}

function DownloadModal(props: DownloadModalProps) {
  const { isAuthenticated } = useContext(AppContext).authenticationContext;
  const { filters, nldiIds } = useContext(FilterContext);

  const [ searchCriteria, setSearchCriteria] = useState<WaterRightsSearchCriteria | null>(null);
  const [ isFetching, setIsFetching ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);
  const [ isFetched, setIsFetched ] = useState<boolean>(false);
  const [ isDownloadLimitError, setIsDownloadLimitError ] = useState<boolean>(false);

  const close = () => {
    props.setShow(false);
    setIsError(false);
  }

  const download = async () => 
  {
    setIsError(false);
    setSearchFilterValues();
    setIsFetching(true);
  }

  useEffect(() => {
    if (isFetched && !isError){
      props.setShow(false);
      setIsFetched(false);
    }
  }, [isFetched, props, setIsFetched, isError])

  // technical debt, move this to a shared space and also update TableView to use this share space. to clean copy pasted code
  const setSearchFilterValues = () => {
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
      states: filters.states,
      filterUrl: filters !== null ? window.location.href : undefined,
      wadeSitesUuids: nldiIds
    });
  }

  return (
    <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
        { !isAuthenticated && <label>Login for Download Access</label> }
        { isAuthenticated && !isDownloadLimitError && <label>Download</label> }
        { isAuthenticated && isDownloadLimitError && <label>Download Limit</label> }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      { !isAuthenticated && <p>
          Sign up <strong>completely free</strong> or login for download access of up to 100,000
          water rights points.
        </p>}
        {/* display generic error message */}
        { isAuthenticated && isError && !isDownloadLimitError &&
          <p>An error occurred while attempting to download the data. Please adjust your filters to reduce the data-set and try again.</p>} 
          {/* display download limit error message */}
          { isAuthenticated && isError && isDownloadLimitError &&
            <p>You tried downloading a water rights dataset containing more than the supported limit for software efficiency reasons.<br/><br/>
            Please adjust your filters to reduce the dataset size to less than 100,000 water rights and try the download again.<br/><br/>
            If not, don't hesitate to get in touch with the WaDE Team for a larger dataset request.</p>} 
        {/* display donwload message to continue with download if user is authenticated */}
        { isAuthenticated && !isFetching && !isError &&
          <p>Download access limited up to a maximum of 100,000 water rights points. Click Download to continue</p>}
        {/* display modal with is fetching info and progress bar with it */}
        { isAuthenticated && isFetching && !isError &&
        <DownloadWaterRights
          searchCriteria={searchCriteria}
          setIsError={setIsError}
          setIsFetching={setIsFetching}
          setIsFetched={setIsFetched}
          setIsDownloadLimitError={setIsDownloadLimitError}/>}
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-between'}}>
      <Button className="btn btn-secondary" onClick={close}>Cancel</Button>
      {!isAuthenticated && <Button className="sign-in-button" ><SignIn /></Button>}
      {isAuthenticated && !isFetching && !isError && <Button onClick={download}>Download</Button>}
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadModal;
