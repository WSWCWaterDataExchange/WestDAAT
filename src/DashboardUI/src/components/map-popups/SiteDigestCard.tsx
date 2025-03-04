import React, { useMemo } from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiChevronLeftBox, mdiChevronRightBox, mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';
import SiteDigest from '../../data-contracts/SiteDigest';
import { FormattedDate } from "../FormattedDate";

interface SiteDigestMapPopupProps {
  site: SiteDigest;
  currentIndex: number;
  onSelectedIndexChanged: (index: number) => void;
  onClosePopup: () => void;
}

function SiteDigestCard(props: SiteDigestMapPopupProps) {
  const { onClosePopup, currentIndex, onSelectedIndexChanged } = props;
  const { siteType, siteUuid, hasTimeSeriesData, timeSeriesVariableTypes, waterRightsDigests } = props.site;
  const currWaterRight = useMemo(() => {
    return waterRightsDigests[currentIndex];
  }, [waterRightsDigests, currentIndex]);

  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div>
            Site ID:{' '}
            <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
              {siteUuid} <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon"/>
            </a>
          </div>
        ),
        body: (
          <div className="map-popup-card-water-rights-body">
            <div className="mb-2">
              <div>
                <strong>Site Type:</strong>
              </div>
              {siteType}
            </div>
            <div className="map-popup-card-water-rights-native-id-row">
              <strong>Water Right Native ID:</strong>{' '}
              <WaterRightsMapPopupToggle
                count={waterRightsDigests.length}
                currentIndex={currentIndex}
                setCurrentIndex={onSelectedIndexChanged}
              />
            </div>
            <div>
              {!currWaterRight ? (
                <div className="mb-2">(no water right data)</div>
              ) : (
                <div className="mb-2">
                  <div>{currWaterRight.nativeId}{' '}</div>
                  <div>
                    <a href={`/details/right/${currWaterRight.allocationUuid}`} target="_blank"
                       rel="noopener noreferrer">
                      View Water Right Landing Page{' '}
                      <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon"/>
                    </a>
                  </div>
                </div>
              )}

            </div>
            <div className="mb-2">
              <div>
                <strong>Beneficial Use:</strong>
              </div>
              {currWaterRight ? (
                <>
                  {currWaterRight.beneficialUses.map((a) => (
                    <div key={a}>{a}</div>
                  ))}
                </>
              ) : (
                <div>-</div>
              )}
            </div>

            <div className="mb-2">
              <div>
                <strong>Priority Date:</strong>
              </div>
              <div>
                {currWaterRight ? (
                  <FormattedDate>{currWaterRight.priorityDate}</FormattedDate>
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>

            <div className="mb-2">
              <div>
                <strong>Has Time Series Data:</strong>
              </div>
              {hasTimeSeriesData ? (
                <div className="mb-2">
                  <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
                    View Time Series Landing Page{' '}
                    <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon"/>
                  </a>
                </div>
              ) : (
                <div className="mb-2">
                  (no time series data)
                </div>
              )}
            </div>

            <div className="mb-0">
              <div>
                <strong>Time Series Variable Type:</strong>
              </div>
              <div>
                {timeSeriesVariableTypes.length > 0 ? (
                  timeSeriesVariableTypes.map((a) => (
                    <div key={a}>{a}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

interface WaterRightsMapPopupToggleProps {
  count: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

function WaterRightsMapPopupToggle(props: WaterRightsMapPopupToggleProps) {
  const { count, currentIndex, setCurrentIndex } = props;
  if (count <= 1) return null;
  return (
    <>
      <button onClick={() => setCurrentIndex((currentIndex - 1 + count) % count)} className="nav-prev-water-right">
        <Icon path={mdiChevronLeftBox}/>
      </button>
      <span>
        {currentIndex + 1} of {count}
      </span>
      <button onClick={() => setCurrentIndex((currentIndex + 1) % count)} className="nav-next-water-right">
        <Icon path={mdiChevronRightBox}/>
      </button>
    </>
  );
}


export default SiteDigestCard;
