import React from 'react';
import { StatesSelect } from './StatesSelect';
import BeneficialUseSelect from './BeneficialUseSelect';
import { WaterSourceTypesSelect } from './WaterSourceTypesSelect';
import { AllocationOwnerSearch } from './AllocationOwnerSearch';
import { OwnerClassificationType } from './OwnerClassificationType';
import { AllocationTypeSelect } from './AllocationTypeSelect';
import { LegalStatusSelect } from './LegalStatusSelect';
import { SiteTypeSelect } from './SiteTypeSelect';
import { RiverBasinSelect } from './RiverBasinSelect';
import { SiteContent } from './SiteContent';
import { PriorityDateRange } from './PriorityDateRange';
import { FlowRange } from '../../nldi/components/FlowRange';
import { VolumeRange } from './VolumeRange';
import { PodPou } from '../../../map-options/components/PodPou';
import MapGrouping from '../../../map-options/components/MapGrouping';
import PointSize from '../../../map-options/components/PointSize';

function WaterRights() {
  return (
    <>
      <div className="mb-3">
        <a
          href="https://westernstateswater.org/wade/westdaat-filter-documentation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about WestDAAT filters
        </a>
      </div>
      <MapGrouping />
      <PointSize />
      <PodPou />
      <StatesSelect />
      <BeneficialUseSelect />
      <WaterSourceTypesSelect />
      <AllocationOwnerSearch />
      <OwnerClassificationType />
      <AllocationTypeSelect />
      <LegalStatusSelect />
      <SiteTypeSelect />
      <RiverBasinSelect />
      <SiteContent />
      <PriorityDateRange />
      <FlowRange />
      <VolumeRange />
    </>
  );
}

export default WaterRights;
