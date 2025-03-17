import { Placeholder } from 'react-bootstrap';

interface ApplicationFormSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  isLoading?: boolean;
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

      <div className="row">
        {props.isLoading ? (
          <Placeholder as="div" animation="glow">
            <Placeholder xs={12} className="mb-4" />
          </Placeholder>
        ) : (
          props.children
        )}
      </div>
    </div>
  );
}

export default ApplicationFormSection;
