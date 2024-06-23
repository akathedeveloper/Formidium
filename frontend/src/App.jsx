// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import MetaMaskConnect from './components/MetaMaskConnect';
import UserInvoices from './components/UserInvoices';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/admin">Admin Page</Link>
        </nav>
        <Switch>
          <Route exact path="/" component={MetaMaskConnect} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/user/:recipientAddress/invoices" component={UserInvoices} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
