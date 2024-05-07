import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Home from './Home';
import Player from './Player';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/api/v1" component={Home}></Route>
        <Route path="/player/:id" component={Player}></Route>
      </Switch>
    </Router>
  );
}

export default App;
