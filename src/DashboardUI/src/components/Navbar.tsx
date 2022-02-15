function Navbar() {
  return (
    <div className="">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <div>
            <button className="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <span className="navbar-brand mb-0 h1">Western States Water Council</span>
          </div>

          <span className="navbar-brand mb-0 h3 justify-content-center">Water Data Exchange Data (WaDE) Dashboard</span>

          <div className="justify-content-end">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Log in</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div>
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">Water Rights</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Aggregations</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Site Specific</a>
              </li>
            </ul>
          </div>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary ms-1">View Table Results</button>
            <button type="button" className="btn btn-primary ms-1">Download Data</button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
