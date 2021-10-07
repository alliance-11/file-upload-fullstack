import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Signup from './Signup';
import UserList from './UserList';

console.log( "API_URL: ", process.env.REACT_APP_API_BASE_URL )

function App() {

  return (
    <div className="App">
      <header className="App-header">        
        <Switch>
          <Route exact path="/" component={ Signup }></Route>
          <Route path="/users" component={ UserList }></Route>
        </Switch>
      </header>
    </div>
  );
}

export default App;
