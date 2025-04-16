import React from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiChevronLeft, mdiChevronRight, mdiOpenInNew } from '@mdi/js';
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

  const showNavigation = total && total > 1;

  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div className="flex justify-between items-center">
            <div>
              <strong>Site ID:</strong>{' '}
              <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
                {siteUuid}{' '}
                <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
              </a>
            </div>
            {showNavigation && (
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <button
                  onClick={goToPrevious}
                  className="p-0.5 hover:bg-gray-100 rounded transition"
                  aria-label="Previous"
                >
                  <Icon path={mdiChevronLeft} size={0.8} />
                </button>
                <span className="px-1">{(currentIndex ?? 0) + 1} of {total}</span>
                <button
                  onClick={goToNext}
                  className="p-0.5 hover:bg-gray-100 rounded transition"
                  aria-label="Next"
                >
                  <Icon path={mdiChevronRight} size={0.8} />
                </button>
              </div>
            )}
          </div>
        ),
        body: (
          <div className="map-popup-card-water-rights-body">
            <div className="mb-2">
              <strong>Site Type:</strong>
              <div>{siteType}</div>
            </div>
            <div className="mb-2">
              <strong>Water Right Digests:</strong>
              {waterRightsDigests.length === 0 ? (
                <div>(no water right data)</div>
              ) : (
                waterRightsDigests.map((right, i) => (
                  <div key={i} className="mb-2 border-b pb-2">
                    <div>{right.nativeId}</div>
                    <div>
                      <a
                        href={`/details/right/${right.allocationUuid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Water Right Landing Page{' '}
                        <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
                      </a>
                    </div>
                    <div>
                      <strong>Beneficial Uses:</strong>
                      {right.beneficialUses.map((use) => (
                        <div key={use}>{use}</div>
                      ))}
                    </div>
                    <div>
                      <strong>Priority Date:</strong>{' '}
                      <FormattedDate>{right.priorityDate}</FormattedDate>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mb-2">
              <strong>Has Time Series Data:</strong>
              <div>
                {hasTimeSeriesData ? (
                  <a
                    href={`/details/site/${siteUuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Time Series Landing Page{' '}
                    <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
                  </a>
                ) : (
                  '(no time series data)'
                )}
              </div>
            </div>
            <div className="mb-0">
              <strong>Time Series Variable Types:</strong>
              <div>
                {timeSeriesVariableTypes.length > 0 ? (
                  timeSeriesVariableTypes.map((type) => <div key={type}>{type}</div>)
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

export default SiteDigestCard;
