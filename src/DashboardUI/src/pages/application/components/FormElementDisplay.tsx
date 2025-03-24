interface FormElementDisplay {
  label: string;
  displayValue: any;
}

function FormElementDisplay(props: FormElementDisplay) {
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

export default FormElementDisplay;
