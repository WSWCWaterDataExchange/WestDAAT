export interface ApplicationFormSectionRuleProps {
  width: number;
}

export function ApplicationFormSectionRule(props: ApplicationFormSectionRuleProps) {
  return <hr className="text-primary" style={{ borderWidth: props.width }} />;
}
