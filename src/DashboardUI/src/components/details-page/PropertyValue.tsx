import React, { useMemo } from "react";
import { FormattedDate } from "../FormattedDate";
import moment from "moment";
import { formatNumber } from "../../utilities/valueFormatters";
import TruncatedText from "../TruncatedText";

interface PropertyValueProps {
  label: string;
  value: string | number | Date | JSX.Element | undefined;
  decimalPositions?: number;
  isVerbose?: boolean;
  isUrl?: boolean;
  isTruncated?: boolean;
}

export function PropertyValue({ label, value, decimalPositions = undefined, isVerbose = false, isUrl = false, isTruncated = false,}: PropertyValueProps) {
  const formattedValue = useMemo(() => {
    if (isUrl && typeof value === 'string') {
      return value && <a href={value} target="_blank" rel="noopener noreferrer">View</a>;
    }
    if (typeof value === 'number') {
      return formatNumber(value, decimalPositions);
    }
    if (typeof value === 'string' && moment(value, true).isValid()) {
      return <FormattedDate>{value}</FormattedDate>;
    }
    return value;
  }, [value, isUrl, decimalPositions]);

  // Added text truncation logic 
  const content = isTruncated ? (
    <TruncatedText text={String(formattedValue)} />
  ) : (
    formattedValue
  );

  return (
    <>
      <span className='property-name'>{label}</span>
      <span className={`property-value${isVerbose ? ' is-verbose' : ''}`}>{content}</span>
    </>
  );
}