import moment, { MomentInput } from "moment";

export interface FormattedDateProps{
  children: MomentInput,
  noValueFallback?: string
}
export function FormattedDate(props: FormattedDateProps){
  const {children: dateValue, noValueFallback} = props;
  const fallback = noValueFallback ? <>noValueFallback</> : null;
  if(!dateValue)
  {
    return fallback;
  }
  const date = moment(dateValue);
  if(date.isValid()){
    return <>{date.format("MM/DD/YYYY")}</>
  }
  return fallback;
}