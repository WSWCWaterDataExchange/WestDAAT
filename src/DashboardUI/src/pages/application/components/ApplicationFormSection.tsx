import { Placeholder } from 'react-bootstrap';

interface ApplicationFormSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  isLoading?: boolean;
  loadingSections?: number;
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
        {props.isLoading
          ? new Array(props.loadingSections ?? 4).fill(0).map((_, index) => (
              <Placeholder animation="glow" className="col-3">
                <Placeholder key={index} xs={12} className="rounded fs-3 mb-3" />
              </Placeholder>
            ))
          : props.children}
      </div>
    </div>
  );
}

export default ApplicationFormSection;
