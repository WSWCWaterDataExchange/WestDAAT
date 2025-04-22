import React, { useMemo } from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiChevronLeftBox, mdiChevronRightBox, mdiOpenInNew, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';
import SiteDigest from '../../data-contracts/SiteDigest';
import { FormattedDate } from '../FormattedDate';

interface SiteDigestCardProps {
  site: SiteDigest;
  onClosePopup: () => void;
  currentIndex?: number;
  total?: number;
  goToNext?: () => void;
  goToPrevious?: () => void;
}

function SiteDigestCard({
  site,
  onClosePopup,
  currentIndex,
  total,
  goToNext,
  goToPrevious,
}: SiteDigestCardProps) {
  const { siteType, siteUuid, hasTimeSeriesData, timeSeriesVariableTypes, waterRightsDigests } = site;
  const currWaterRight = useMemo(() => {
    return waterRightsDigests[currentIndex || 0];
  }, [waterRightsDigests, currentIndex]);

  const showNavigation = total && total > 1;

  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div>
            Site ID:{' '}
            <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
              {siteUuid} <Icon path={mdiOpenInNew} className="map-popup-card-waterRights-link-icon"/>
            </a>
          </div>
        ),
        body: (
          <div className="map-popup-card-waterRights-body">
            <div className="mb-2">
              <div>
                <strong>Site Type:</strong>
              <div>{siteType}</div>
              </div>
            </div>
            <div className="map-popup-card-waterRights-native-id-row">
              <strong>Water Right Native ID:</strong>{' '}
              {currWaterRight ? (
                <span>{currWaterRight.nativeId}</span>
              ) : (
                <span>(no water right data)</span>
              )}
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
                      <Icon path={mdiOpenInNew} className="map-popup-card-waterRights-link-icon"/>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-2">
              <div>
                <strong>Has Time Series Data:</strong>
              </div>
              <div>
                {hasTimeSeriesData ? (
                  <a
                    href={`/details/site/${siteUuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Time Series Landing Page{' '}
                    <Icon path={mdiOpenInNew} className="map-popup-card-waterRights-link-icon" />
                  </a>
                ) : (
                  '(no time series data)'
                )}
              </div>
            </div>
            <div className="mb-2">
              <div>
                <strong>Water Right Digests:</strong>
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
            <div className="mb-0">
              <div>
                <strong>Time Series Variable Types:</strong>
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
        footer: showNavigation && (
          <div className="flex justify-between items-center text-xs text-gray-700">
            <button
              onClick={goToPrevious}
              className="hover:bg-gray-100 transition"
              aria-label="Previous"
            >
              <Icon path={mdiChevronLeft} size={0.5} />
            </button>
            <span className="px-1">{(currentIndex ?? 0) + 1} of {total}</span>
            <button
              onClick={goToNext}
              className="hover:bg-gray-100 transition"
              aria-label="Next"
            >
              <Icon path={mdiChevronRight} size={0.5} />
            </button>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

export default SiteDigestCard;
