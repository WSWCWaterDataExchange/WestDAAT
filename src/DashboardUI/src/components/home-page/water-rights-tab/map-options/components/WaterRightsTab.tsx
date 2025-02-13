import React from 'react';
import MapProvider from '../../../../../contexts/MapProvider';
import MainPanel from '../../../MainPanel';
import SidePanel from '../../../SidePanel';
import TableView from '../../../TableView';
import { useWaterRightsContext, WaterRightsProvider } from '../../sidebar-filtering/WaterRightsProvider';
import SideBar from '../../sidebar-filtering/SideBar';
import Map from '../../../../map/Map';
import { useDisplayOptions } from '../hooks/useDisplayOptions';
import { useFilters } from '../../sidebar-filtering/useFilters';
import { useMapUrlParameters } from '../../../hooks/useMapUrlParameters';
import { usePolylinesFilter } from '../hooks/usePolylinesFilter';
import DownloadModal from './DownloadModal';
import UploadModal from './UploadModal';
import { useEffect } from 'react';
import { useHomePageContext } from '../../../Provider';
import { useMapFitRequested } from '../hooks/useMapFitRequested';
import { OverlaysProvider } from '../../sidebar-filtering/OverlaysProvider';
import { TimeSeriesProvider } from '../../sidebar-filtering/TimeSeriesProvider';
import { SiteActionbar } from '../../../../SiteActionbar';

interface WaterRightsTabProps {
  showDownloadModal?: (show: boolean) => void;
  showUploadModal?: (show: boolean) => void;
}

export function WaterRightsTab({ showDownloadModal, showUploadModal }: WaterRightsTabProps) {
  return (
    <MapProvider>
      <WaterRightsProvider>
        <OverlaysProvider>
          <TimeSeriesProvider>
            <WaterRightsLayout showDownloadModal={showDownloadModal} showUploadModal={showUploadModal} />
          </TimeSeriesProvider>
        </OverlaysProvider>
      </WaterRightsProvider>
    </MapProvider>
  );
}

interface WaterRightsLayoutProps {
  showDownloadModal?: (show: boolean) => void;
  showUploadModal?: (show: boolean) => void;
}

function WaterRightsLayout({ showDownloadModal, showUploadModal }: WaterRightsLayoutProps) {
  useDisplayOptions();
  useFilters();
  useMapUrlParameters();
  useDownloadModal();
  useUploadModal();

  const { polylinesOnMapUpdated } = usePolylinesFilter();
  const { handleMapFitRequested } = useMapFitRequested();

  return (
    <>
      <SidePanel>
        <SideBar />
      </SidePanel>
      <MainPanel>
        <SiteActionbar showDownloadModal={showDownloadModal} showUploadModal={showUploadModal} />
        <div style={{ position: 'relative', flexGrow: 1, height: '100%' }}>
          <Map
            handleMapDrawnPolygonChange={polylinesOnMapUpdated}
            handleMapFitChange={handleMapFitRequested}
            isConsumptiveUseAlertEnabled={true}
            isGeocoderInputFeatureEnabled={true}
          />
          <TableView />
        </div>
      </MainPanel>
    </>
  );
}

function useDownloadModal() {
  const { setDownloadModal } = useHomePageContext();
  const { filters, nldiIds } = useWaterRightsContext();
  useEffect(() => {
    setDownloadModal(<DownloadModal filters={filters} nldiIds={nldiIds} />);
  }, [filters, nldiIds, setDownloadModal]);
}

function useUploadModal() {
  const { setUploadModal } = useHomePageContext();
  useEffect(() => {
    setUploadModal(<UploadModal />);
  }, [setUploadModal]);
}
