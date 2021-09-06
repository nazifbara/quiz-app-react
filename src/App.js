import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { Auth, Hub, DataStore } from 'aws-amplify';

import Home from './Home';
import Quiz from './Quiz';
import Dashboard from './Dashboard';

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  let history = useHistory();

  useEffect(() => {
    Hub.listen('auth', async (data) => {
      switch (data.payload.event) {
        case 'signIn':
          setUserAuthenticated(true);
          break;
        case 'signOut':
          setUserAuthenticated(false);
          await DataStore.clear();
          break;
        default:
          break;
      }
    });
    Auth.currentAuthenticatedUser()
      .then(() => setUserAuthenticated(true))
      .catch(() => setUserAuthenticated(false));

    return () => {
      Hub.remove('auth');
    };
  }, []);

  function signOut() {
    Auth.signOut();
    history.push('/');
  }

  return (
    <>
      <header>
        <div className="container container--hp">
          <nav>
            <Link to="/" className="app-name">
              QuizApp
            </Link>
            <div className="menu">
              <Link className="menu_item" to="/dashboard">
                Dashboard
              </Link>
              {userAuthenticated && (
                <button className="menu_item logout" onClick={signOut}>
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>
      <div className="container container--hp container--vp">
        <Switch>
          <Route path="/quiz/:quizId?">
            <Quiz />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
