interface FormElementProps {
  label: string;
  displayValue: any;
}

function FormElement(props: FormElementProps) {
  const { label, displayValue } = props;

  return (
    <>
      <div>
        <span className="text-muted">{label}</span>
      </div>
      <div>
        <span>{displayValue || '-'}</span>
      </div>
    </>
  );
}

export default FormElement;
