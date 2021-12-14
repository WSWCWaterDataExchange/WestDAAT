import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MapView from './MapView';
import AllocationDetails from './AllocationDetails';
import AllocationJsonLd from './AllocationJsonLd';

function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={MapView}></Route>
      <Route exact path='/details/:allocationId' component={AllocationDetails}></Route>
      <Route exact path='/details/:allocationId/json-ld' component={AllocationJsonLd}></Route>
    </Switch>
  );
}

export default App;
