import React, { JSX, useMemo } from 'react';
import { FormattedDate } from '../FormattedDate';
import moment from 'moment';
import { formatNumber } from '../../utilities/valueFormatters';
import LineClampText from '../LineClampText';

interface PropertyValueProps {
  label: string;
  value: string | number | Date | JSX.Element | undefined;
  decimalPositions?: number;
  isVerbose?: boolean;
  isUrl?: boolean;
  isTruncated?: boolean;
}

export function PropertyValue({
  label,
  value,
  decimalPositions = undefined,
  isVerbose = false,
  isUrl = false,
}: PropertyValueProps) {
  const formattedValue = useMemo(() => {
    if (isUrl && typeof value === 'string') {
      return (
        value && (
          <a href={value} target="_blank" rel="noopener noreferrer">
            View
          </a>
        )
      );
    }
    if (typeof value === 'number') {
      return formatNumber(value, decimalPositions);
    }
    if (value instanceof Date || (typeof value === 'string' && moment(value, true).isValid())) {
      return <FormattedDate>{value}</FormattedDate>;
    }
    return value;
  }, [value, isUrl, decimalPositions]);

  const content = isVerbose ? <LineClampText text={String(formattedValue)} /> : formattedValue;

  return (
    <>
      <div className="property-name">{label}</div>
      <div className={`property-value${isVerbose ? ' is-verbose' : ''}`}>{content}</div>
    </>
  );
}
