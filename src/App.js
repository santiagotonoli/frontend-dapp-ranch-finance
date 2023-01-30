import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';

import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import pickLoan from './reducers/pickLoan'
import dataLoans from './reducers/dataLoans'
import listLoans from './reducers/listLoans'
import collections from './reducers/collections'

import LoansHome from './LoansHome';
import LoansDetails from './LoansDetails'

const store = createStore(combineReducers({pickLoan, dataLoans, listLoans, collections}))

function App() {
  return (

    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={LoansHome} path="/" exact />
          <Route component={LoansDetails} path="/details/:id" exact />
        </Switch>
      </Router>
    </Provider>
    
  );
}

export default App;