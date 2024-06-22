import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage.jsx';
import './App.css';

function App() {
  const [count, setCount] = useState(0); // State declaration for count

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/admin">Admin Page</Link>
        </nav>
        <Switch>
          <Route exact path="/">
            <div>
              <div>
                <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                  <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                  <img src="/src/assets/react.svg" className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount(count + 1)}>
                  count is {count}
                </button>
                <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </div>
          </Route>
          <Route path="/admin" component={AdminPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
