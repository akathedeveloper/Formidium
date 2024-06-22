import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import AdminPage from './components/AdminPage.jsx';
import MetaMaskConnect from './components/MetaMaskConnect.jsx';
import UserInvoices from './components/UserInvoices.jsx';
import './App.css';

function App() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/admin">Admin Page</Link>
        </nav>
        <Switch>
          <Route exact path="/">
            <MetaMaskConnect />
          </Route>
          <Route path="/admin" component={AdminPage} />
          <Route path="/user/:recipientAddress/invoices" component={UserInvoices} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
