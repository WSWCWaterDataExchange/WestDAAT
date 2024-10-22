import React from 'react';
import { ChangeEvent } from 'react';
import { useAllocationOwnerFilter } from '../hooks/filters/useAllocationOwnerFilter';

export function AllocationOwnerSearch() {
  const { allocationOwner, setAllocationOwner } = useAllocationOwnerFilter();

  const handleChangeAllocationOwner = (e: ChangeEvent<HTMLInputElement>) => {
    setAllocationOwner(e.target.value);
  };

  return (
    <div className="mb-3">
      <label htmlFor="wr-allocation-owner-search">
        Search Allocation Owner
      </label>
      <input
        id="wr-allocation-owner-search"
        type="text"
        className="form-control"
        onChange={handleChangeAllocationOwner}
        value={allocationOwner}
      />
    </div>
  );
}
