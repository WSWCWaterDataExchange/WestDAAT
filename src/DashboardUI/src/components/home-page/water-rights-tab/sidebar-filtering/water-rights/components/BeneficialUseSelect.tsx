import React, { JSX } from 'react';
import Select from 'react-select';
import { BeneficialUseListItem, ConsumptionCategoryType } from '../../../../../../data-contracts/BeneficialUseListItem';
import CloseCircleOutline from 'mdi-react/CloseCircleOutlineIcon';
import SyncIcon from 'mdi-react/SyncIcon';
import { useCallback, useEffect, useState } from 'react';
import { useBeneficialUsesFilter } from "../hooks/useBeneficialUsesFilter";
import { useWaterRightsContext } from '../../WaterRightsProvider';

interface GroupedOption {
  readonly label: string;
  options: BeneficialUseChangeOption[];
}

interface BeneficialUseChangeOption {
  readonly value: string;
  readonly label: JSX.Element;
  readonly consumptiveFilter: boolean;
  readonly category?: ConsumptionCategoryType;
}

const consumptiveOption: BeneficialUseChangeOption = {
  value: 'ConsumptiveType',
  category: ConsumptionCategoryType.Consumptive,
  label: (
    <>
      <span>Consumptive </span>
      <CloseCircleOutline color="red" />
    </>
  ),
  consumptiveFilter: true,
};

const nonconsumptiveOption: BeneficialUseChangeOption = {
  value: 'NonConsumptiveType',
  category: ConsumptionCategoryType.NonConsumptive,
  label: (
    <>
      <span>Non-Consumptive </span>
      <SyncIcon color="green" />
    </>
  ),
  consumptiveFilter: true,
};

const unspecifiedOption: BeneficialUseChangeOption = {
  value: 'UnspecifiedType',
  category: ConsumptionCategoryType.Unspecified,
  label: (
    <>
      <span>Unspecified </span>
    </>
  ),
  consumptiveFilter: true,
};

function BeneficialUseSelect() {
  const { beneficialUseNames, setBeneficialUseNames } = useBeneficialUsesFilter();

  const {
    hostData: {
      beneficialUsesQuery: { data: allBeneficialUses },
    },
  } = useWaterRightsContext();

  const mapBeneficialUseToBeneficialUseListItem = useCallback(
    (name: string) => ({
      beneficialUseName: name,
      consumptionCategory:
        allBeneficialUses?.find((b) => b.beneficialUseName === name)?.consumptionCategory ??
        ConsumptionCategoryType.Unspecified,
    }),
    [allBeneficialUses],
  );

  const mapToBeneficialUseListItem = (selectedOptions: BeneficialUseChangeOption[]) => {
    return selectedOptions?.map((a) => a.value).filter((a) => a !== undefined) as string[];
  };

  const mapToBeneficialUseOptions = (beneficialUses: BeneficialUseListItem[] | undefined) => {
    return beneficialUses
      ?.map((a) => {
        let label = <span>{a.beneficialUseName}</span>;

        if (a.consumptionCategory === ConsumptionCategoryType.Consumptive) {
          label = (
            <>
              <span>{a.beneficialUseName} </span>
              <CloseCircleOutline color="red" />
            </>
          );
        } else if (a.consumptionCategory === ConsumptionCategoryType.NonConsumptive) {
          label = (
            <>
              <span>{a.beneficialUseName} </span>
              <SyncIcon color="green" />
            </>
          );
        }
        return {
          value: a.beneficialUseName,
          label: label,
          category: a.consumptionCategory,
        };
      })
      .filter((a) => a !== undefined) as BeneficialUseChangeOption[];
  };

  const formatGroupLabel = (data: GroupedOption) => (
    <div className="group-styles">
      <span className="filter-header-style">{data.label}</span>
    </div>
  );

  const handleChanges = (currentSelectedOptions: BeneficialUseChangeOption[]): void => {
    if (currentSelectedOptions.some((option) => option.consumptiveFilter === true)) {
      // filter by category option selected
      const selected: string[] = [];
      currentSelectedOptions.forEach((option) => {
        if (option.consumptiveFilter) {
          const newSelected = allBeneficialUses?.filter((f) => f.consumptionCategory === option.category) ?? [];
          newSelected.forEach((beneficialUse) => {
            if (!currentSelectedOptions.some((f) => f.value === beneficialUse.beneficialUseName)) {
              selected.push(beneficialUse.beneficialUseName);
            }
          });
        }
      });
      setBeneficialUseNames([
        ...mapToBeneficialUseListItem(currentSelectedOptions.filter((f) => f.consumptiveFilter !== true)),
        ...selected,
      ]);
    } else {
      setBeneficialUseNames(mapToBeneficialUseListItem(currentSelectedOptions));
    }
  };

  useEffect(() => {
    const allSelected = (categoryType: ConsumptionCategoryType) => {
      const selectedCountByCategory = beneficialUseNames
        ?.map(mapBeneficialUseToBeneficialUseListItem)
        .filter((option) => option.consumptionCategory === categoryType).length;
      const totalCountByCategory = allBeneficialUses?.filter(
        (option) => option.consumptionCategory === categoryType,
      ).length;

      return selectedCountByCategory === totalCountByCategory;
    };

    const consumptiveCategoryOptions = [];
    if (!allSelected(ConsumptionCategoryType.Consumptive)) {
      consumptiveCategoryOptions.push(consumptiveOption);
    }
    if (!allSelected(ConsumptionCategoryType.NonConsumptive)) {
      consumptiveCategoryOptions.push(nonconsumptiveOption);
    }
    if (!allSelected(ConsumptionCategoryType.Unspecified)) {
      consumptiveCategoryOptions.push(unspecifiedOption);
    }

    const groupedOptions: GroupedOption[] = [
      {
        label: 'Filter by Beneficial Use Category',
        options: consumptiveCategoryOptions,
      },
      {
        label: 'Filter by Specified Beneficial Use',
        options: mapToBeneficialUseOptions(allBeneficialUses),
      },
    ];
    setAvailableDropDownOptions(groupedOptions);
  }, [beneficialUseNames, allBeneficialUses, mapBeneficialUseToBeneficialUseListItem]);

  const [availableDropdownOptions, setAvailableDropDownOptions] = useState<GroupedOption[]>([]);

  return (
    <div className="mb-3">
      <label htmlFor="beneficial-uses-filter">Beneficial Use</label>
      <Select<BeneficialUseChangeOption, true, GroupedOption>
        id="beneficial-uses-filter"
        isMulti
        options={availableDropdownOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={(a) => handleChanges([...a])}
        closeMenuOnSelect={false}
        placeholder="Select Beneficial Use(s)"
        name="beneficialUse"
        value={mapToBeneficialUseOptions(beneficialUseNames?.map(mapBeneficialUseToBeneficialUseListItem))}
      />
    </div>
  );
}

export default BeneficialUseSelect;
