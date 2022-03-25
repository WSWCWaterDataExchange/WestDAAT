import { useMemo } from "react";
import { MapPopupCard } from "./MapPopupCard";
import { mdiChevronRightBox, mdiChevronLeftBox, mdiOpenInNew } from '@mdi/js';
import Icon from "@mdi/react";
import WaterRightDigest from "../data-contracts/WaterRightsDigest";

interface WaterRightsMapPopupToggleProps {
  count: number, currentIndex: number, setCurrentIndex: (index: number) => void;
}
function WaterRightsMapPopupToggle(props: WaterRightsMapPopupToggleProps) {
  const { count, currentIndex, setCurrentIndex } = props;
  if (count <= 1) return null;
  return (
    <>
      <button onClick={() => setCurrentIndex((currentIndex - 1 + count) % count)} className="nav-prev-water-right">
        <Icon path={mdiChevronLeftBox} />
      </button>
      <span>{currentIndex + 1} of {count}</span>
      <button onClick={() => setCurrentIndex((currentIndex + 1) % count)} className="nav-next-water-right">
        <Icon path={mdiChevronRightBox} />
      </button>
    </>
  )
}

interface WaterRightsMapPopupProps {
  waterRights: WaterRightDigest[],
  siteUuid: string,
  currentIndex: number,
  onSelectedIndexChanged: (index: number) => void,
  onClosePopup: () => void;
}
function WaterRightsMapPopup(props: WaterRightsMapPopupProps) {
  const { waterRights, siteUuid, currentIndex, onSelectedIndexChanged, onClosePopup } = props;
  const currWaterRight = useMemo(() => {
    return waterRights[currentIndex];
  }, [waterRights, currentIndex]);
  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: `Site ID: ${siteUuid}`,
        body: <div className="map-popup-card-water-rights-body">
          <div className="mb-2">
            <div className="map-popup-card-water-rights-native-id-row">
              <strong>Water Right Native ID:</strong> <WaterRightsMapPopupToggle count={waterRights.length} currentIndex={currentIndex} setCurrentIndex={onSelectedIndexChanged} />
            </div>
            <div>
              <a href={`/details/right/${currWaterRight.id}`} target="_blank" rel="noreferrer">{currWaterRight.nativeId} <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" /></a>
            </div>
          </div>
          <div className="mb-2">
            <div>
              <strong>Beneficial Use:</strong>
            </div>
            {currWaterRight.beneficialUses.map(a => <div key={a}>{a}</div>)}
          </div>
          <div className="mb-0">
            <div>
              <strong>Priority Date:</strong>
            </div>
            <div>
              {currWaterRight.priorityDate}
            </div>
          </div>
        </div>
      }}
    </MapPopupCard>
  );
}

export default WaterRightsMapPopup;