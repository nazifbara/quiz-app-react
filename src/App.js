import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './Home';
import Quiz from './Quiz';

function App() {
  return (
    <Router>
      <header>
        <div className="container container--hp">
          <Link to="/" className="app-name">
            QuizApp
          </Link>
        </div>
      </header>
      <div className="container container--hp container--vp">
        <Switch>
          <Route path="/quiz">
            <Quiz />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
