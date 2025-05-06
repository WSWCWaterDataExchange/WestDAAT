import React, { useState, useMemo } from 'react';
import MapPopupCard from './MapPopupCard';
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiOpenInNew,
  mdiChevronLeftBox,
  mdiChevronRightBox
} from '@mdi/js';
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
  const {
    siteType,
    siteUuid,
    hasTimeSeriesData,
    timeSeriesVariableTypes,
    waterRightsDigests,
  } = site;

  const [selectedRightIndex, setSelectedRightIndex] = useState(0);
  const currentRight = useMemo(
    () => waterRightsDigests[selectedRightIndex],
    [waterRightsDigests, selectedRightIndex]
  );

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
                <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon inline" />
              </a>
            </div>
          </div>
        ),
        body: (
          <div className="map-popup-card-water-rights-body">
            <div className="mb-2">
              <strong>Site Type:</strong>
              <div>{siteType}</div>
            </div>

            <div className="mb-2">
              <div className="map-popup-card-water-rights-native-id-row">
                <strong>Water Right Native ID:</strong>{' '}
                <WaterRightsMapPopupToggle
                  count={waterRightsDigests.length}
                  currentIndex={selectedRightIndex}
                  setCurrentIndex={setSelectedRightIndex}
                />
              </div>

              {!currentRight ? (
                <div className="mb-2">(no water right data)</div>
              ) : (
                <div className="mb-2 border-b pb-2">
                  <div>{currentRight.nativeId}</div>
                  <div className="mt-1">
                    <a
                      href={`/details/right/${currentRight.allocationUuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Water Right Landing Page{' '}
                      <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
                    </a>
                  </div>
                  <div className="mt-1">
                    <strong>Beneficial Uses:</strong>
                    {currentRight.beneficialUses.map((use) => (
                      <div key={use}>{use}</div>
                    ))}
                  </div>
                  <div className="mt-1">
                    <strong>Priority Date:</strong>{' '}
                    <FormattedDate>{currentRight.priorityDate}</FormattedDate>
                  </div>
                </div>
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

interface WaterRightsMapPopupToggleProps {
  count: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

function WaterRightsMapPopupToggle({
                                     count,
                                     currentIndex,
                                     setCurrentIndex,
                                   }: WaterRightsMapPopupToggleProps) {
  if (count <= 1) return null;

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + count) % count);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % count);
  };

  return (
    <>
      <button
        onClick={() => setCurrentIndex((currentIndex - 1 + count) % count)}
        className="nav-prev-water-right"
      >
        <Icon path={mdiChevronLeftBox} />
      </button>
      <span>
        {currentIndex + 1} of {count}
      </span>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % count)}
        className="nav-next-water-right"
      >
        <Icon path={mdiChevronRightBox} />
      </button>
    </>
  );
}

export default SiteDigestCard;
