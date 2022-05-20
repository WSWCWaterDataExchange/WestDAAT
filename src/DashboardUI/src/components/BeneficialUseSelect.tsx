import Select, { StylesConfig } from 'react-select';
import { BeneficialUseListItem, ConsumptionCategoryType } from '../data-contracts/BeneficialUseListItem';
import CloseCircleOutline from 'mdi-react/CloseCircleOutlineIcon';
import SyncIcon from 'mdi-react/SyncIcon';
import { CSSProperties } from 'react';

interface BeneficialUseSelectProps {
  options: BeneficialUseListItem[] | undefined;
  selectedOptions: BeneficialUseListItem[] | undefined;
  onChange: (selectedOptions: BeneficialUseListItem[]) => void;
}

interface GroupedOption {
  readonly label: string;
  readonly options: readonly BeneficialUseChangeOption[];
}

interface BeneficialUseChangeOption {
  readonly value: string;
  readonly label: JSX.Element;
  readonly consumptiveFilter: boolean;
  readonly category?: ConsumptionCategoryType;
}

const consumptiveCategoryOptions: BeneficialUseChangeOption[] = [
  { value: 'ConsumptiveType', category: ConsumptionCategoryType.Consumptive, label: <><span>Consumptive </span><CloseCircleOutline color="red" /></>, consumptiveFilter: true },
  { value: 'NonConsumptiveType', category: ConsumptionCategoryType.NonConsumptive, label: <><span>Non-Consumptive </span><SyncIcon color="green" /></>, consumptiveFilter: true },
  { value: 'UnspecifiedType', category: ConsumptionCategoryType.Unspecified, label: <><span>Unspecified </span></>, consumptiveFilter: true },
];

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

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };
  const groupBadgeStyles: CSSProperties = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center"
  };
  const filterHeaderStyle: CSSProperties = {
    fontWeight: "bold",
    color: "black",
    fontSize: 12
  }
  const formatGroupLabel = (data: GroupedOption) => (
    <div style={groupStyles}>
      <span style={filterHeaderStyle}>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options?.length}</span>
    </div>
  );

  const selectedOptions: BeneficialUseChangeOption[] = mapToBeneficialUseOptions(props.selectedOptions);

  const handleChanges = (currentSelectedOptions: BeneficialUseChangeOption[]): void => {
    if (currentSelectedOptions.some(typeFilter => typeFilter.consumptiveFilter === true)) {
      var selected: BeneficialUseListItem[] = [];
      currentSelectedOptions.forEach(option => {
        if (option.consumptiveFilter) {
          var newSelected = props.options?.filter(f => f.consumptionCategory === option.category) ?? [];
          newSelected.forEach(beneficialUse => { selected.push(beneficialUse) });
        }
      })
      props.onChange([...mapToBeneficialUseListItem(currentSelectedOptions), ...selected]);
    } else {
      props.onChange(mapToBeneficialUseListItem(currentSelectedOptions));
    }
  }

  return (
    <>
      <Select<BeneficialUseChangeOption, true, GroupedOption>
        isMulti
        options={groupedOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={a => handleChanges([...a])}
        closeMenuOnSelect={false}
        value={selectedOptions}
      />
    </>
  );
}

export default BeneficialUseSelect;
