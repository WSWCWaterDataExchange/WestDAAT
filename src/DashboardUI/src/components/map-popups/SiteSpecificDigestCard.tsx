import { useMemo } from "react";
import MapPopupCard from "./MapPopupCard";
import { mdiChevronRightBox, mdiChevronLeftBox, mdiOpenInNew } from '@mdi/js';
import Icon from "@mdi/react";
import SiteSpecificDigest from "../../data-contracts/SiteSpecificDigest";

interface SiteSpecificMapPopupToggleProps {
  count: number, currentIndex: number, setCurrentIndex: (index: number) => void;
}
function SiteSpecificPopupToggle(props: SiteSpecificMapPopupToggleProps) {
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

interface SiteSpecificMapPopupProps {
  siteSpecific: SiteSpecificDigest[],
  siteUuid: string,
  currentIndex: number,
  onSelectedIndexChanged: (index: number) => void,
  onClosePopup: () => void;
}
function SiteSpecificDigestCard(props: SiteSpecificMapPopupProps) {
  const { siteSpecific, siteUuid, currentIndex, onSelectedIndexChanged, onClosePopup } = props;
  const currSiteSpecific = useMemo(() => {
    return siteSpecific[currentIndex];
  }, [siteSpecific, currentIndex]);
  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: <div>Site ID: <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">{siteUuid} <Icon path={mdiOpenInNew} className="map-popup-card-site-specific-link-icon" /></a></div>,
        body: <div className="map-popup-card-site-specific-body">
          {/* <div className="mb-2">
            <div className="map-popup-card-site-specific-native-id-row">
              <strong>Water Right Native ID:</strong> <SiteSpecificPopupToggle count={siteSpecific.length} currentIndex={currentIndex} setCurrentIndex={onSelectedIndexChanged} />
            </div>
            <div>
              <a href={`/details/right/${currSiteSpecific.allocationUuid}`} target="_blank" rel="noopener noreferrer">{currSiteSpecific.nativeId} <Icon path={mdiOpenInNew} className="map-popup-card-site-specific-link-icon" /></a>
            </div>
          </div> */}
          <div className="mb-2">
            <div>
              <strong>Beneficial Use:</strong>
            </div>
            {currSiteSpecific.beneficialUses.map(a => <div key={a}>{a}</div>)}
          </div>
          {/* <div className="mb-0">
            <div>
              <strong>Priority Date:</strong>
            </div>
            <div>
              <FormattedDate>{currSiteSpecific.priorityDate}</FormattedDate>
            </div>
          </div> */}
        </div>
      }}
    </MapPopupCard>
  );
}
export default SiteSpecificDigestCard;