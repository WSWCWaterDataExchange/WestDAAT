import { useMemo } from "react"
import { FormattedDate } from "../FormattedDate"
import moment from "moment"

interface PropertyValueProps {
  label: string,
  value: string | number | Date | JSX.Element | undefined,
  decimalPositions?: number,
  isVerbose?: boolean,
  isUrl?: boolean
}
export function PropertyValue({label, value, decimalPositions = 0, isVerbose = false, isUrl = false}: PropertyValueProps) {
  const formattedValue = useMemo(() =>{
    if(isUrl && typeof value === 'string'){
      return value && <a href={value} target="_blank" rel="noopener noreferrer">View</a>
    }
    if(typeof value === 'number'){
      return value.toLocaleString(undefined, {maximumFractionDigits: decimalPositions, minimumFractionDigits: decimalPositions})
    }
    if(typeof value === 'string' && moment(value, true).isValid()){
      return <FormattedDate>{value}</FormattedDate>
    }
    return value;
  }, [value, isUrl, decimalPositions])
  return <>
    <span className='property-name'>{label}</span>
    <span className={`property-value${isVerbose ? ' is-verbose' : ''}`}>{formattedValue}</span>
  </>
}