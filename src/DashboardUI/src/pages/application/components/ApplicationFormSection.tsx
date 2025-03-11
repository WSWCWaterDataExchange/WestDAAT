interface ApplicationFormSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode | undefined;
}

function ApplicationFormSection(props: ApplicationFormSectionProps) {
  return (
    <div className={props.className}>
      <div className="mb-4">
        <div>
          <span className="fs-5">{props.title}</span>
        </div>

        {props.subtitle && (
          <div>
            <span className="text-muted">{props.subtitle}</span>
          </div>
        )}
      </div>

      <div className="row">{props.children}</div>
    </div>
  );
}

export default ApplicationFormSection;
