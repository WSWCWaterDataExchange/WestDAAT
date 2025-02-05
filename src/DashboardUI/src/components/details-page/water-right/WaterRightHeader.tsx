function WaterRightHeader() {
  return (
    <div className="d-flex flex-row align-items-center justify-content-between title-header">
      <div>
        <h3 className="d-flex fw-bold">WaDE Water Right Landing Page</h3>
      </div>

      <div className="d-flex flex-column align-items-end">
        <div className="d-flex flex-row gap-3">
          <div>info circle button</div>
          <div>estimate consumptive use button</div>
        </div>
        <div>
          <span>T&C link text</span>
        </div>
      </div>
    </div>
  );
}

export default WaterRightHeader;
