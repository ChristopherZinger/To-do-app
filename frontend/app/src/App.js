import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import AuthMenu from './components/auth/AuthMenu/AuthMenu';
import { connect } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import TodoMenu from './components/todo/TodoMenu/TodoMenu';

function App(props) {

  return (
    <div className="App">
      <Router>
        <Navbar />

        <div className='container'>
          <Switch>
            <Route path="/auth" component={AuthMenu} />
            <Route path="/todo-menu" component={TodoMenu} />
          </Switch>
        </div>
      </Router>

    </div>
  );
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
  }
}

export default connect(mapStateToProps)(App);
