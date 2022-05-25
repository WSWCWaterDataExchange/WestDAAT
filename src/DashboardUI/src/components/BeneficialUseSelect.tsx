import Select from 'react-select';
import { BeneficialUseListItem, ConsumptionCategoryType } from '../data-contracts/BeneficialUseListItem';
import CloseCircleOutline from 'mdi-react/CloseCircleOutlineIcon';
import SyncIcon from 'mdi-react/SyncIcon';
import { useEffect, useState } from 'react';

interface BeneficialUseSelectProps {
  options: BeneficialUseListItem[] | undefined;
  selectedOptions: BeneficialUseListItem[] | undefined;
  onChange: (selectedOptions: BeneficialUseListItem[]) => void;
}

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

function BeneficialUseSelect(props: BeneficialUseSelectProps) {

  const mapToBeneficialUseListItem = (selectedOptions: BeneficialUseChangeOption[]) => {
    return selectedOptions?.map(a => { return { beneficialUseName: a.value, consumptionCategory: a.category } })
      .filter(a => a !== undefined) as BeneficialUseListItem[]
  }

  const mapToBeneficialUseOptions = (beneficialUses: BeneficialUseListItem[] | undefined) => {

    return beneficialUses?.map(a => {
      var label = <span>{a.beneficialUseName}</span>;

      if (a.consumptionCategory === ConsumptionCategoryType.Consumptive) {
        label = <><span>{a.beneficialUseName} </span><CloseCircleOutline color="red" /></>
      }
      else if (a.consumptionCategory === ConsumptionCategoryType.NonConsumptive) {
        label = <><span>{a.beneficialUseName} </span><SyncIcon color="green" /></>
      }
      return {
        value: a.beneficialUseName,
        label: label,
        category: a.consumptionCategory
      }
    }).filter(a => a !== undefined) as BeneficialUseChangeOption[];
  }

  const consumptiveOption: BeneficialUseChangeOption =
    { value: 'ConsumptiveType', category: ConsumptionCategoryType.Consumptive, label: <><span>Consumptive </span><CloseCircleOutline color="red" /></>, consumptiveFilter: true };

  const nonconsumptiveOption: BeneficialUseChangeOption =
    { value: 'NonConsumptiveType', category: ConsumptionCategoryType.NonConsumptive, label: <><span>Non-Consumptive </span><SyncIcon color="green" /></>, consumptiveFilter: true };

  const unspecifiedOption: BeneficialUseChangeOption =
    { value: 'UnspecifiedType', category: ConsumptionCategoryType.Unspecified, label: <><span>Unspecified </span></>, consumptiveFilter: true };


  const formatGroupLabel = (data: GroupedOption) => (
    <div className='group-styles'>
      <span className='filter-header-style'>{data.label}</span>
    </div >
  );

  const handleChanges = (currentSelectedOptions: BeneficialUseChangeOption[]): void => {
    if (currentSelectedOptions.some(option => option.consumptiveFilter === true)) {
      // filter by category option selected
      var selected: BeneficialUseListItem[] = [];
      currentSelectedOptions.forEach(option => {
        if (option.consumptiveFilter) {
          var newSelected = props.options?.filter(f => f.consumptionCategory === option.category) ?? [];
          newSelected.forEach(beneficialUse => {
            if (!currentSelectedOptions.some(f => f.value === beneficialUse.beneficialUseName)) {
              selected.push(beneficialUse)
            }
          });
        }
      })
      props.onChange([...mapToBeneficialUseListItem(currentSelectedOptions.filter(f => f.consumptiveFilter !== true)), ...selected]);
    } else {
      props.onChange(mapToBeneficialUseListItem(currentSelectedOptions));
    }
  }

  useEffect(() => {

    const allSelected = (categoryType: ConsumptionCategoryType) => {
      const selectedCountByCategory = props.selectedOptions?.filter(option => option.consumptionCategory === categoryType).length;
      const totalCountByCategory = props.options?.filter(option => option.consumptionCategory === categoryType).length;

      return (selectedCountByCategory === totalCountByCategory);
    }

    const calculateAvailableDropDownOptions = () => {
      var consumptiveCategoryOptions = [];
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
          options: mapToBeneficialUseOptions(props.options),
        },
      ];
      return groupedOptions;
    }

    setAvailableDropDownOptions(calculateAvailableDropDownOptions());
  }, [props.selectedOptions])

  const [availableDropdownOptions, setAvailableDropDownOptions] = useState<GroupedOption[]>([])

  return (
    <>
      <Select<BeneficialUseChangeOption, true, GroupedOption>
        isMulti
        options={availableDropdownOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={a => handleChanges([...a])}
        closeMenuOnSelect={false}
        value={mapToBeneficialUseOptions(props.selectedOptions)}
      />
    </>
  );
}

export default BeneficialUseSelect;
