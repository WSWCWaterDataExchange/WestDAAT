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

export function WaterRightsTab() {
  return (
    <MapProvider>
      <WaterRightsProvider>
        <OverlaysProvider>
          <TimeSeriesProvider>
            <WaterRightsLayout />
          </TimeSeriesProvider>
        </OverlaysProvider>
      </WaterRightsProvider>
    </MapProvider>
  );
}

function WaterRightsLayout() {
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
        <Map
          handleMapDrawnPolygonChange={polylinesOnMapUpdated}
          handleMapFitChange={handleMapFitRequested}
          consumptiveUseAlertEnabled={true}
        />
        <TableView />
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
