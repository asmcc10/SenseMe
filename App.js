import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';


import Home from './Pages/Home';
import Summary from './Pages/Summary';
import Account from './Pages/Account';

function App() {
  return (
      <div>
          <Router>
              <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/Summary' component={Summary} />
                  <Route path='/Account' component={Account} />
              </Switch>
          </Router>
      
    </div>
  );
}

export default App;
